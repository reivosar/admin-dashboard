import React, { useState } from "react";
import DOMPurify from "dompurify";

type MessageDisplayProps = {
  channelId: number;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ channelId }) => {
  const [messages, setMessages] = useState([
    { id: 0, text: "Welcome to Slack clone!" },
  ]);

  return (
    <div className="messages flex-1 overflow-y-auto p-4">
      {messages.map((msg) => {
        const cleanHTML = DOMPurify.sanitize(msg.text);
        return (
          <div
            key={msg.id}
            className="message bg-white p-2 my-2 rounded shadow"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          ></div>
        );
      })}

      <style jsx>{`
        .channel-list {
          background-color: #003366;
          color: white;
          width: 256px;
          padding: 20px;
          border-radius: 8px;
        }

        .channel-list li:hover {
          background-color: #676767;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default MessageDisplay;
