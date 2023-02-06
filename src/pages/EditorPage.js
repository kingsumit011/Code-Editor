import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Action';
import Client from '../components/Client'
import Editor from '../components/Editor'
import {Navigate, useLocation , useNavigate, useParams} from 'react-router-dom'
import { initSocket } from '../Socket';
import { toast } from 'react-hot-toast';


const EditorPage = () => {

  const socketRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const roomId = params.roomId;
  const reactNaviagator = useNavigate();
  const [clients , setClinets] = useState([]);




  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connection_error', (err) => handleError(err) );
      socketRef.current.on('connection_failed', (err) => handleError(err) );
      function handleError(err) {
        console.log('error' , err);
        toast.error('Socket connection failed , Try Again Later')
        reactNaviagator("/")
      }
      // console.log('roomId',roomId);
      //Emit for Joining the room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName, 
      });

      //Listen for the joined event
      socketRef.current.on(ACTIONS.JOINED, ({
        clients,
        userName ,
        socketId}) => {
          console.log('${userName}joined the room' , userName)
          console.log('${clients} joined the room' , clients)
          if(userName !== location.state?.userName) {
            toast.success(`${userName} joined the room`)
          }
          setClinets(clients)
        })
    
    }
    init();
  } ,[])




  if(!location.state||!location.state?.userName) {
    return <Navigate to='/'/>
  }

  return (
    <div className='editorPageWrapper'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImg' src='/code-sync.png' alt='code-sync-logo' />
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients?.map((client) => (
                <Client 
                key={client.socketId}
                userName={client.userName}/>
              ))
            }
          </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className='editor'>
        <Editor/>
      </div>
    </div>
  )
}



export default EditorPage
