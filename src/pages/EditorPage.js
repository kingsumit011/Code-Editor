import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../Action";
import Client from "../components/Client";
import Editor from "../components/Editor";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { initSocket } from "../Socket";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const roomId = params.roomId;
  const reactNaviagator = useNavigate();
  const [clients, setClinets] = useState([]);

  async function copyRoomId() {
    try {
      navigator.clipboard.writeText(roomId);
      toast.success("Room Id Copied");
    } catch (err) {
      console.log(err);
      toast.error("Room Id Copy Failed");
    }
  }
  function leaveRoom() {
    reactNaviagator("/");
  }
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection_error", (err) => handleError(err));
      socketRef.current.on("connection_failed", (err) => handleError(err));
      function handleError(err) {
        console.log("error", err);
        toast.error("Socket connection failed , Try Again Later");
        reactNaviagator("/");
      }
      // console.log('roomId',roomId);
      //Emit for Joining the room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      //Listen for the joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, userName, socketId }) => {
          // console.log('${userName}joined the room' , userName)
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room`);
          }
          setClinets(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, { code:codeRef.current, socketId });
        }
      );

      //Listen for the disconnected event
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClinets((clients) => {
          return clients.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state || !location.state?.userName) {
    return <Navigate to="/" />;
  }

  return (
    <div className="editorPageWrapper">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              className="logoImg"
              src="/code-sync.png"
              alt="code-sync-logo"
            />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients?.map((client) => (
              <Client key={client.socketId} userName={client.userName} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editor">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
