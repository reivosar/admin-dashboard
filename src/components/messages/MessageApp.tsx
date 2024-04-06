import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  DraftBlockType,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const MessageApp = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [messages, setMessages] = useState([
    { id: 0, text: "Welcome to Slack clone!" },
  ]);

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onToggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const onToggleBlockType = (type: DraftBlockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  const handleSend = () => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    if (text.trim() !== "") {
      const newMsg = { id: messages.length, text };
      setMessages([...messages, newMsg]);
      setEditorState(EditorState.createEmpty());
    }
  };

  return (
    <div className="app-container flex" style={{ height: "80vh" }}>
      <div className="channel-list bg-gray-900 text-white w-64 p-4">
        <h2 className="text-xl font-semibold mb-4">Channels</h2>
        <ul className="list-none">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            <i className="fas fa-comments mr-2"></i> # general
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            <i className="fas fa-random mr-2"></i> # random
          </li>
        </ul>
      </div>
      <div className="message-area flex flex-col flex-1 bg-gray-100">
        <div className="messages flex-1 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="message bg-white p-2 my-2 rounded shadow"
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="editor bg-white p-4 border rounded flex flex-col justify-between">
          <div
            style={{
              minHeight: "15px",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              placeholder="Type your message here..."
            />
          </div>
          <div className="flex justify-between items-center w-full mt- pt-2 border-t-2 border-gray-200">
            <div className="toolbar flex items-center">
              <button
                onClick={() => onToggleStyle("BOLD")}
                className="font-bold mr-2"
              >
                B
              </button>
              <button
                onClick={() => onToggleStyle("ITALIC")}
                className="italic mr-2"
              >
                I
              </button>
              <button
                onClick={() => onToggleStyle("UNDERLINE")}
                className="underline mr-2"
              >
                U
              </button>
              <button
                onClick={() => onToggleBlockType("unordered-list-item")}
                className="mr-2"
                title="Bulleted List"
              >
                •••
              </button>
              <button
                onClick={() => onToggleBlockType("ordered-list-item")}
                className="mr-2"
                title="Numbered List"
              >
                123
              </button>
            </div>
            <div className="flex items-center">
              <button onClick={handleSend} className="icon-button">
                <PaperAirplaneIcon className="h-8 w-8" />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .toolbar button {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 5px 10px;
          margin-right: 8px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
          width: 50px;
          text-align: center;
        }

        .toolbar button:hover {
          background-color: #e0e0e0;
          color: #000;
        }

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

        .icon-button {
          background-color: #f0f0f0;
          border-radius: 8px;
          box-shadow: 4px 4px 8px #e0e0e0, -4px -4px 8px #ffffff; /* ソフトな陰影で立体感を演出 */
          padding: 8px;
          cursor: pointer;
        }

        .icon-button:hover {
          box-shadow: 2px 2px 4px #e0e0e0, -2px -2px 4px #ffffff; /* ホバー時に陰影を細かく */
        }
      `}</style>
    </div>
  );
};

export default MessageApp;
