import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  onConfirm: () => void;
}

export const showConfirmDialog = ({
  title = "",
  message,
  onConfirm,
}: ConfirmDialogOptions) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "20px",
            width: "400px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h1>{title}</h1>
          <p>{message}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{
                marginRight: "10px",
                padding: "5px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Yes
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "5px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#6c757d",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              No
            </button>
          </div>
        </div>
      );
    },
  });
};
