import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { sql } from "@codemirror/lang-sql";
import { ExecuteSQLResultType } from "@/types/debug";

const ExecuteSQL = () => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [results, setResults] = useState<ExecuteSQLResultType | null>(null);
  const [query, setQuery] = useState("SELECT * FROM ");
  const [error, setError] = useState("");
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (editorContainerRef.current) {
      const startState = EditorState.create({
        doc: query,
        extensions: [
          basicSetup,
          sql(),
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              const currentQuery = update.state.doc.toString();
              setQuery(currentQuery);
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorContainerRef.current,
      });
      setEditorView(view);

      editorContainerRef.current.style.height = "325px";
      editorContainerRef.current.style.border = "1px solid #ddd";
      editorContainerRef.current.style.borderRadius = "4px";
      editorContainerRef.current.style.overflow = "auto";
      editorContainerRef.current.style.border = "1px solid #ddd";
      editorContainerRef.current.style.resize = "vertical";

      return () => {
        view.destroy();
      };
    }
  }, []);

  const executeQuery = async () => {
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/debug/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const clearQuery = () => {
    const initialQuery = "SELECT * FROM ";
    if (editorView) {
      const update = editorView.state.update({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: initialQuery,
        },
      });
      editorView.dispatch(update);
    }
    setQuery(initialQuery);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-center">
        <div className="w-full max-w-[calc(100%-40px)] px-6 py-4">
          <div ref={editorContainerRef} className="editor-container" />
          <div className="flex justify-end space-x-3 mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={executeQuery}
            >
              Execute
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={clearQuery}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      {error && <p className="px-6 py-4 text-red-500">{error}</p>}
      {results && (
        <div className="px-6 py-4 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {results.headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {results.headers.map((header) => (
                    <td
                      key={`${rowIndex}-${header}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExecuteSQL;
