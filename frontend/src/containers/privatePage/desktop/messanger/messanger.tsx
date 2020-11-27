import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../../../contexts/socketProvider";
import {
  addChatByChatObject,
  addChatByFriendId,
} from "../../../../store/actions/messangerActions";
import { IChat } from "../../../../store/reducers/chatsReducers";
import { IRoot } from "../../../../store/reducers/rootReducer";
import Conversation from "../../conversation/conversation";

const Messanger: React.FC = () => {
  const socket = useSocket();

  const activeChats = useSelector(
    (state: IRoot) => state.messanger.activeChats
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const setSocket = () => {
      if (socket === null) return;
      socket.on("new_message", (msg: any) => {
        mounted && dispatch(addChatByFriendId(msg.author_id));
      });
    };

    setSocket();
    return () => {
      mounted = false;
    };
  }, [socket]);

  return (
    <div>
      {activeChats &&
        activeChats.map((chat: IChat, i) => {
          return <Conversation chat={chat} key={chat._id} chatIndex={i} />;
        })}
    </div>
  );
};

export default Messanger;
