import React, { useCallback, useEffect, useRef, useState } from "react";
import { IChat } from "../../../store/reducers/chatsReducers";
import styles from "./conversation.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import { api, authenticationHeader } from "../../../config/apiHost";
import Message from "../../../components/privatePage/message/message";
import { IMessage } from "../../../components/privatePage/message/message";
import { useMediaQuery } from "react-responsive";
import { removeChat } from "../../../store/actions/messangerActions";
import ClipLoader from "react-spinners/ClipLoader";
import { useSocket } from "../../../contexts/socketProvider";
import firebase, { storage } from "../../../config/firebase";
import { v4 as uuidv4 } from "uuid";

interface IParams {
  chat: IChat;
  chatIndex?: number;
}

const MobileConversation: React.FC<IParams> = ({ chat, chatIndex }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });
  let mounted = true;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastMessageDate, setLastMessageDate] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // ref to loading div
  const postLoader = useRef<HTMLDivElement>(null);
  // is any more posts in database
  const [hasMore, setHasMore] = useState(true);

  const [text, setText] = useState("");

  const [member, setMember] = useState({ ...chat.member });

  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const [choosenPhotoUrl, setChoosenPhotoUrl] = useState<string | null>(null);
  const [choosenPhoto, setChoosenPhoto] = useState<File | null>(null);
  const [choosePhotoError, setChoosePhotoError] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [sendingPhotoUrl, setSendingPhotoUrl] = useState<string | null>(null);

  // receipt new message
  useEffect(() => {
    const setSocket = () => {
      if (socket === null) return;

      socket.on("new_message", (msg: any) => {
        if (!currentUser) return;
        const sender = {
          avatar: chat.member.avatar,
          name: chat.member.name,
          surname: chat.member.surname,
          _id: chat.member._id,
        };

        let newmessage = JSON.parse(JSON.stringify(msg));

        newmessage.author_id = sender;

        setMessages((prevState) => [newmessage, ...prevState]);
      });

      socket.on("online", (msg: string) =>
        setMember({ ...member, online: true })
      );
      socket.on("offline", (msg: string) =>
        setMember({ ...member, online: false })
      );
    };

    setSocket();
  }, [socket]);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    setIsLoading(true);
    let url;
    if (lastMessageDate)
      url = `http://localhost:5000/api/message/getMessages/${chat._id}?limit=${perPage}&date=${lastMessageDate}`;
    else
      url = `http://localhost:5000/api/message/getMessages/${chat._id}?limit=${perPage}`;

    api
      .get(url, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        if (mounted) {
          if (resp.data.length === 0) {
            setIsLoading(false);
            setFetchError("");
            setHasMore(false);
            return;
          }
          setMessages((prevState) => [...prevState, ...resp.data]);
          if (resp.data.length < perPage) setHasMore(false);
          setLastMessageDate(resp.data[resp.data.length - 1].created_at);
          setFetchError("");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setFetchError("Problem z pobraniem postów.");
          setIsLoading(false);
        }
      });
  };

  //infinity scroll - intersection observer callback function
  const loadMore = useCallback(
    (entries) => {
      const target = entries.find(
        (element: IntersectionObserverEntry) => element.target.id === chat._id
      );
      if (target.isIntersecting && hasMore && lastMessageDate && !isLoading) {
        getMessages();
      }
    },
    [hasMore, lastMessageDate, getMessages, isLoading]
  );

  //infinity scroll - intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (postLoader && postLoader.current) observer.observe(postLoader.current);

    return () => {
      if (postLoader.current) observer.unobserve(postLoader.current);
    };
  }, [postLoader, loadMore]);

  // "enter" button handler
  const onChangeHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessageHandler();
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("test");
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setChoosePhotoError("");
        setChoosenPhoto(file);
        setChoosenPhotoUrl(URL.createObjectURL(file));
      } else {
        setChoosePhotoError("Zły format pliku!");
        setChoosenPhoto(null);
        setChoosenPhotoUrl(null);
      }
    }
  };

  const handlePhotoUpload = async () => {
    if (choosenPhoto) {
      const fileName = `${uuidv4()}`;
      const uploadTask = storage.ref(`images/${fileName}`).put(choosenPhoto);
      await uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        (err) => {},
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              sendMessage(url);
            });
        }
      );
    }
  };

  const removePhoto = () => {
    setChoosenPhotoUrl(null);
    setChoosenPhoto(null);
    setChoosePhotoError("");
  };

  const sendMessageHandler = () => {
    if (choosenPhotoUrl) {
      handlePhotoUpload();
    } else {
      if (text === "") return;
      else sendMessage(null);
    }
  };

  const sendMessage = (photoUrl: string | null) => {
    //delete new line marks from text
    const newText = text.replace(/(\r\n|\n|\r)/gm, "");
    currentUser &&
      api
        .post(
          `http://localhost:5000/api/message/sendMessage/${chat._id}`,
          {
            author_id: currentUser._id,
            text: newText,
            photo: photoUrl ? photoUrl : null,
            recipient: chat.member._id,
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          const sender = {
            avatar: currentUser.avatar,
            name: currentUser.name,
            surname: currentUser.surname,
            _id: currentUser._id,
          };

          let newmessage = JSON.parse(JSON.stringify(resp.data));

          newmessage.author_id = sender;

          setMessages((prevState) => [newmessage, ...prevState]);
          setText("");
          removePhoto();
        });
  };

  // change unseen messages status as seen
  const seeMessages = () => {
    api
      .post(
        `http://localhost:5000/api/message/seeMessages/${chat._id}`,
        {
          user_id: currentUser?._id,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        console.log("wiadomosci odczytane");
      });
  };

  return (
    <div
      className={styles.conversationContainer}
      style={
        isDesktopOrLaptop
          ? { right: `calc(15vw + ${chatIndex} * 37.5rem)` }
          : undefined
      }
    >
      <div className={styles.header}>
        {!isDesktopOrLaptop && (
          <NavLink to={`/friends`}>
            <div className={styles.backArrow}>
              <i className="fas fa-chevron-left"></i>
            </div>
          </NavLink>
        )}
        <NavLink to={`/profile/${chat.member._id}`}>
          <div className={styles.memberInfo}>
            <div className={styles.statusDot}>
              {member.online && <i className={`fas fa-circle `}></i>}
            </div>
            <img
              src={member.avatar}
              alt="user avatar"
              width="50px"
              height="50px"
            />
            {member.name} {member.surname}
          </div>
        </NavLink>

        {isDesktopOrLaptop && (
          <div
            className={styles.exitButton}
            onClick={() => dispatch(removeChat(chat._id))}
          >
            <i className="fas fa-times"></i>{" "}
          </div>
        )}
      </div>
      <div className={styles.messages}>
        {choosenPhotoUrl && (
          <div className={styles.messagePhoto}>
            <img src={choosenPhotoUrl} />
            <div className={styles.removePhotoButton}>
              <i className="fas fa-times" onClick={() => removePhoto()}></i>
            </div>
          </div>
        )}
        {messages &&
          messages.map((message) => (
            <Message message={message} key={message._id} />
          ))}
        <div ref={postLoader} id={chat._id} style={{ padding: "1rem" }}>
          {hasMore && <ClipLoader color={"#276a39"} />}
        </div>
      </div>
      <div className={styles.sendMessage}>
        <div className={styles.addImage}>
          <input
            id="message-photo-upload"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              console.log("lol");
              handlePhotoChange(e);
            }}
          />
          <label htmlFor="message-photo-upload">
            <i className="fas fa-image"></i>
          </label>
        </div>
        <TextareaAutosize
          onFocus={() => seeMessages()}
          autoFocus
          className={styles.editorInput}
          placeholder="Napisz wiadomość..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => onChangeHandler(e)}
        />
        <div className={styles.sendImage} onClick={() => sendMessageHandler()}>
          <i className="fas fa-paper-plane"></i>
        </div>
      </div>
    </div>
  );
};

export default MobileConversation;
