import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { MessageResponse } from "@/types/messages";
import { UserCircleIcon } from "@heroicons/react/solid";

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
        const isCurrentUser = msg.isOwnMessage;
        const alignmentClass = isCurrentUser
          ? "items-end text-right"
          : "items-start text-left";
        const backgroundClass = isCurrentUser ? "bg-white" : "bg-gray-100";
        const cleanHTML = DOMPurify.sanitize(msg.content);
        return (
          <div>
            <div className={`text-xs text-gray-600 ${alignmentClass}`}>
              <span>
                {new Date(msg.sendedAt).toLocaleDateString()}{" "}
                {new Date(msg.sendedAt).toLocaleTimeString()}
              </span>
            </div>
            <div
              key={msg.id}
              className={`message flex flex-col my-2 mx-3 p-3 rounded-lg shadow ${backgroundClass} ${alignmentClass} space-y-1`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
                className="message-text"
              ></div>
            </div>
            <div className={`flex space-x-2 ${alignmentClass}`}>
              <UserCircleIcon className="h-6 w-6 text-gray-500" />
              <span className="font-medium">
                {msg.sendedBy?.name || "Unknown"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageResponder;
