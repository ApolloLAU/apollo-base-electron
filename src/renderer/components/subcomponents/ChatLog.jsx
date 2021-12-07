import React, { useEffect, useState } from 'react';

import styles from './css/ChatLog.module.css';

// type ChatLogProps = {
//   isActive: boolean;
//   messages: ChatMessage[];
//   onSend: React.MouseEventHandler<HTMLButtonElement>;
//   chatValue: string;
//   setChatValue: (arg0: string) => void;
// };
//
// type ChatMessageProps = {
//   message: ChatMessage;
// };

function ChatMessageComponent({ message }) {
  const [isSender, setIsSender] = useState(false);
  useEffect(() => {
    setIsSender(message.isSenderBase());
  });

  const date = message.createdAt;

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let formattedDate = '';
  if (isToday(date)) {
    formattedDate = `${date.getHours()}:${date.getMinutes()}`;
  } else {
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    formattedDate = `${day}-${month}-${year}`;
  }

  const imgUrl = message.getImage();
  return (
    <div className={isSender ? styles.sentMessage : styles.receivedMessage}>
      {imgUrl !== null ? (
        <img src={imgUrl} alt="msg-pic" />
      ) : (
        <p className={styles.messageText}>{message.getMessage()}</p>
      )}
      <p className={styles.messageDate}>{formattedDate}</p>
    </div>
  );
}

export default function ChatLog({
  isActive,
  messages,
  onSend,
  chatValue,
  setChatValue,
}) {
  const onValChange = (evt) => {
    setChatValue(evt.target.value);
  };
  return (
    <div>
      <div className={styles.messageList}>
        {messages.map((m, ind) => (
          <ChatMessageComponent message={m} key={ind} />
        ))}
      </div>
      {isActive ? (
        <div>
          <input className={styles.chatInput} type="text" value={chatValue} onChange={onValChange} />
          <button className={styles.sendButton} type="submit" onClick={onSend}>
            Send
          </button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
