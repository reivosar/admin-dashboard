import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { MessageResponse } from "@/types/messages";

type CMessageResponderProps = {
  channelId: number | undefined;
};

const MessageResponder: React.FC<CMessageResponderProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  useEffect(() => {
    if (!channelId) {
      console.log("Channel ID is undefined");
      return;
    }
    setMessages([]);

    const eventSource = new EventSource(
      `/api/messages/response?channelId=${channelId}`
    );

    eventSource.onmessage = (event) => {
      try {
        console.log("Received data:", event.data);
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    eventSource.onerror = (event) => {
      const source = event.currentTarget as EventSource;
      if (source.readyState === EventSource.CLOSED) {
        console.log("EventSource closed by the server.");
      } else {
        console.error("EventSource encountered an error:", event);
      }
      eventSource.close();
    };

    return () => {
      console.log("Closing EventSource.");
      eventSource.close();
    };
  }, [channelId]);

  return (
    <div className="messages flex-1 overflow-y-auto p-4">
      {messages.map((msg) => {
        const cleanHTML = DOMPurify.sanitize(msg.content);
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

export default MessageResponder;
