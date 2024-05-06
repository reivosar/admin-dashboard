import { post } from "@/utils/api";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import DOMPurify from "dompurify";
import {
  ContentBlock,
  DraftEditorCommand,
  EditorState,
  RichUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import { useState, useMemo, useEffect } from "react";
import { toastError } from "../utils/ToastNotifications";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface MessageComposeFormProps {
  channelId: number | undefined;
}

const MessageComposeForm: React.FC<MessageComposeFormProps> = ({
  channelId,
}) => {
  const [editorEnable, setEditorEnable] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    setEditorEnable(true);
  }, []);

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

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

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

  return (
    <div className="editor bg-white p-4 border rounded flex flex-col justify-between">
      <div
        style={{
          minHeight: "15px",
          padding: "5px",
          borderRadius: "4px",
        }}
      >
        {editorEnable && (
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            toolbar={{
              options: ["inline", "blockType"],
            }}
          />
        )}
      </div>
      <div className="flex justify-between items-center w-full mt- pt-2 border-t-2 border-gray-200">
        <div className="flex justify-end w-full">
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
