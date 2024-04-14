import React, { useState, useEffect } from "react";
import { get } from "@/utils/api";
import { PlusIcon } from "@heroicons/react/solid";
import ChannelCreateModal from "./ChannelSettingsModal";
import { ChannelModel } from "@/types/messages/channels";
import { LockClosedIcon } from "@heroicons/react/solid";

interface ChannelsListViewProps {
  onChannelSelect: (id: number) => void;
}

const ChannelsListView: React.FC<ChannelsListViewProps> = ({
  onChannelSelect,
}) => {
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await get<ChannelModel[]>("/api/messages/channels");
      if (response.data) {
        setChannels(response.data);
      }
    };
    fetchChannels();
  }, [modalIsOpen]);

  return (
    <div className="channel-list bg-gray-900 text-white w-64 p-4">
      <h2 className="text-xl font-semibold mb-4">Channels</h2>
      <button
        onClick={handleOpenModal}
        className="create-channel-icon absolute top-4 right-4"
        title="Create new channel"
      >
        <PlusIcon className="h-6 w-6 text-white" />
      </button>
      <ChannelCreateModal isOpen={modalIsOpen} onClose={handleCloseModal} />
      <ul className="list-none">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className="hover:bg-gray-700 p-2 rounded cursor-pointer"
            onClick={() => onChannelSelect(channel.id)}
          >
            <div className="flex items-center">
              {channel.isPublic ? (
                ""
              ) : (
                <LockClosedIcon className="h-5 w-5 mr-1" />
              )}
              <span>{channel.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .channel-list {
          background-color: #003366;
          color: white;
          width: 256px;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          max-height: 80vh;
          overflow-y: auto;
        }

        .channel-list::-webkit-scrollbar {
          width: 8px;
        }

        .channel-list::-webkit-scrollbar-track {
          background: #f0f0f0;
        }

        .channel-list::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 2px solid #f0f0f0;
        }

        .create-channel-icon {
          background: none;
          border: 2px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          padding: 5px;
          transition: transform 0.2s ease-in-out, border-color 0.2s ease,
            color 0.2s ease;
        }

        .create-channel-icon:hover {
          transform: scale(1.2);
          color: #556789;
          border-color: #556789;
        }

        .channel-list li:hover {
          background-color: #676767;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ChannelsListView;
