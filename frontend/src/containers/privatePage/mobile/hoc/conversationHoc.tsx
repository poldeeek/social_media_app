import React from "react";
import { useLocation } from "react-router";
import Conversation from "../../conversation/conversation";
import { IChat } from "../../../../store/reducers/chatsReducers";

const ConversationHoc: React.FC = () => {
  const { state } = useLocation<IChat>();

  return <Conversation chat={state} />;
};

export default ConversationHoc;
