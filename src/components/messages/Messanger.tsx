import React, { useState } from "react";
import MessageChannels from "./MessageChannels";
import MessageResponder from "./MessageResponder";
import MessageSender from "./MessageSender";

const Messanger = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<number>();

  const handleChannelSelect = (channelId: number) => {
    setSelectedChannelId(channelId);
  };

  return (
    <div className="app-container flex" style={{ height: "80vh" }}>
      <MessageChannels onChannelSelect={handleChannelSelect} />
      <div className="message-area flex flex-col flex-1 bg-gray-100">
        <MessageResponder channelId={selectedChannelId} />
        <MessageSender channelId={selectedChannelId} />
      </div>
    </div>
  );
};

export default Messanger;
