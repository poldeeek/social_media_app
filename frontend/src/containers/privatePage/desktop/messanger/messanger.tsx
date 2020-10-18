import React from "react";
import { useSelector } from "react-redux";
import { IChat } from "../../../../store/reducers/chatsReducers";
import { IRoot } from "../../../../store/reducers/rootReducer";
import Conversation from "../../conversation/conversation";

const Messanger: React.FC = () => {
  const activeChats = useSelector(
    (state: IRoot) => state.messanger.activeChats
  );

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
