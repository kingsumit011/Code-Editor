import React, { useEffect, useState } from 'react'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import CodeMirror from 'codemirror';


const Editor = () => {
    useEffect(() => {
        const abortController = new AbortController();
        async function init(){
            console.log("called");

            CodeMirror.fromTextArea(document.getElementById('RealTimeEditor'), {
                mode: {name: "javascript", json: true},
                theme: 'dracula',
                autoCloseBrackets: true,
                autoCloseTags: true,
                lineNumbers: true,
            });
        }
        init();
        return () => abortController.abort();
    },[] )
  return (
    <textarea id='RealTimeEditor'>

    </textarea>
  )
}

export default Editor