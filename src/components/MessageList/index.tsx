import { useEffect, useState } from "react";
import LogoImg from "../../assets/logo.svg";
import { api } from "../../services/api";
import styles from "./styles.module.scss";
import io from "socket.io-client";
type Messages = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};
const messagesQueu: Messages[] = [];
const socket = io("http://localhost:4000");
socket.on("new_message", (newMessage: Messages) => {
  messagesQueu.push(newMessage);
});
export function MessageList() {
  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueu.length > 0) {
        setMessages(prevState =>
          [ messagesQueu[0], prevState[0], prevState[1]].filter(
            Boolean
          )
        );
        messagesQueu.shift();
      }
    });
  }, []);
  
  useEffect(() => {
    //chamada a API
    api.get<Messages[]>("messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <>
      <div className={styles.messageListWrapper}>
        <img src={LogoImg} alt="" />

        <ul className={styles.messageList}>
          {messages?.map((message) => {
            return (
              <li key={message.id} className={styles.message}>
                <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img
                      src={message.user.avatar_url}
                      alt={message.user.name}
                    />
                  </div>
                  <span>{message.user.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
