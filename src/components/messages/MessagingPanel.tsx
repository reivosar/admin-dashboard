import React, { useState } from "react";
import MessageChannels from "./ChannelsListView";
import MessageResponsePanel from "./MessageResponsePanel";
import MessageComposeForm from "./MessageComposeForm";

const MessagingPanel = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<number>();

  const handleChannelSelect = (channelId: number) => {
    setSelectedChannelId(channelId);
  };

  return (
    <div className="app-container flex" style={{ height: "80vh" }}>
      <MessageChannels onChannelSelect={handleChannelSelect} />
      <div className="message-area flex flex-col flex-1 bg-gray-100">
        <MessageResponsePanel channelId={selectedChannelId} />
        <MessageComposeForm channelId={selectedChannelId} />
      </div>
    </div>
  );
};

export default MessagingPanel;
