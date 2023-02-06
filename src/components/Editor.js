import React, { useEffect, useRef, useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import CodeMirror from "codemirror";
import ACTIONS, { CODE_CHANGE } from "../Action";

const Editor = ({ socketRef, roomId , onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      // console.log("called");

      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("RealTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instaces, changes) => {
        console.log("change", changes);
        const { origin } = changes;
        const code = instaces.getValue();
        if (origin !== "setValue") {
          // console.log("change", code);
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
        onCodeChange(code);
        console.log(code);
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // console.log("code-Reciving  ", code);
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
       socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current]);

  return <textarea id="RealTimeEditor"></textarea>;
};

export default Editor;
