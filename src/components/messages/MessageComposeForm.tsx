import { post } from "@/utils/api";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import DOMPurify from "dompurify";
import {
  ContentBlock,
  DraftBlockType,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState, useMemo } from "react";
import { toastError } from "../utils/ToastNotifications";

interface MessageComposeFormProps {
  channelId: number | undefined;
}

const MessageComposeForm: React.FC<MessageComposeFormProps> = ({
  channelId,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const options = useMemo(
    () => ({
      blockRenderers: {
        "unordered-list-item": (block: ContentBlock) =>
          `<div style="padding-left: 25px;"><li style="list-style-type: disc;">${block.getText()}</li></div>`,
        "ordered-list-item": (block: ContentBlock) =>
          `<div style="padding-left: 25px;"><li style="list-style-type: decimal;">${block.getText()}</li></div>`,
      },
    }),
    []
  );

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const dirtyHtml = stateToHTML(contentState, options);
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    const contentType = "text";

    const { error } = await post("/api/messages/send", {
      channelId: channelId,
      type: contentType,
      content: cleanHtml,
    });
    if (error) {
      toastError(error.message);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };

  const onToggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const onToggleBlockType = (type: DraftBlockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  const onToggleInlineCode = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "CODE"));
  };

  return (
    <div className="editor bg-white p-4 border rounded flex flex-col justify-between">
      <div
        style={{
          minHeight: "15px",
          padding: "5px",
          borderRadius: "4px",
        }}
      >
        <Editor
          editorKey="message-sender"
          editorState={editorState}
          onChange={setEditorState}
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
          <button
            onClick={() => onToggleBlockType("code-block")}
            className="mr-2"
          >
            {"{ }"}
          </button>
          <button onClick={onToggleInlineCode} className="tool-btn">
            ` `
          </button>
        </div>
        <div className="flex items-center">
          <button onClick={handleSubmit} className="icon-button">
            <PaperAirplaneIcon className="h-8 w-8" />{" "}
          </button>
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

        .icon-button {
          background-color: #f0f0f0;
          border-radius: 8px;
          box-shadow: 4px 4px 8px #e0e0e0, -4px -4px 8px #ffffff;
          padding: 8px;
          cursor: pointer;
        }

        .icon-button:hover {
          box-shadow: 2px 2px 4px #e0e0e0, -2px -2px 4px #ffffff;
        }
      `}</style>
    </div>
  );
};
export default MessageComposeForm;
