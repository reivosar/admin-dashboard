import React, { useEffect, useRef, useState } from "react";
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
    <div className="relative overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 shadow-md z-10">
        <h1 className="text-xl font-bold">{"Unknown Channel"}</h1>
        <p className="text-gray-600">Channel ID: {channelId}</p>
      </div>
      <div className="messages flex-1 p-4">
        {messages.map((msg) => {
          const cleanHTML = DOMPurify.sanitize(msg.content);
          const userName = msg.sendedBy?.name || "Unknown User";
          return (
            <div
              id={`message-${msg.id}`}
              key={msg.id}
              className="flex flex-col justify-start items-start my-4 mx-auto max-w-6xl"
            >
              <div className="flex items-center space-x-4 mb-2">
                <UserCircleIcon className="h-10 w-10 text-gray-500" />
                <div className="flex items-center">
                  <span className="font-semibold">{userName}</span>
                  <span className="text-xs text-gray-600 ml-4">
                    {new Date(msg.sendedAt).toLocaleDateString()}{" "}
                    {new Date(msg.sendedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="message p-3 bg-white rounded-lg shadow flex flex-col space-y-1 w-full">
                <div
                  dangerouslySetInnerHTML={{ __html: cleanHTML }}
                  className="message-text"
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageResponder;
