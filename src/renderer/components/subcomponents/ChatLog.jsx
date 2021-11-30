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

  const imgUrl = message.getImage();
  return (
    <div className={isSender ? 'sent-msg' : 'received-msg'}>
      {imgUrl !== null ? (
        <img src={imgUrl} alt="msg-pic" />
      ) : (
        <p>{message.getMessage()}</p>
      )}
      <p>{message.createdAt.toLocaleString('en-GB')}</p>
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
          <input type="text" value={chatValue} onChange={onValChange} />
          <button type="submit" onClick={onSend}>
            Send
          </button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
