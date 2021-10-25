import { useEffect, useState } from 'react';
import { ChatMessage } from 'renderer/api/API';

type ChatLogProps = {
  isActive: boolean;
  messages: ChatMessage[];
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

export default function ChatLog({ isActive, messages }: ChatLogProps) {
  return (
    <div>
      <div>
        {messages.map((m, ind) => (
          <ChatMessageComponent message={m} key={ind} />
        ))}
      </div>
      {isActive ? (
        <div>
          <input type="text" />
          <button type="submit">Send</button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
