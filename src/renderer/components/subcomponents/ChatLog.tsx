import React, { useEffect, useState } from 'react';
import { ChatMessage } from 'renderer/api/API';

type ChatLogProps = {
  isActive: boolean;
  messages: ChatMessage[];
  onSend: React.MouseEventHandler<HTMLButtonElement>;
  chatValue: string;
  setChatValue: (arg0: string) => void;
};

type ChatMessageProps = {
  message: ChatMessage;
};

function ChatMessageComponent({ message }: ChatMessageProps) {
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
}: ChatLogProps) {
  const onValChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setChatValue(evt.target.value);
  };
  return (
    <div>
      <div>
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
