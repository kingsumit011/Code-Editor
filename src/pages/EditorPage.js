import React, { useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor';

const EditorPage = () => {
  const [clients , setClinets] = useState([
    {socketId : 1 , userName : 'user 1'},
    {socketId : 3 , userName : 'user 3'},
    {socketId : 2 , userName : 'user 2 '},
    {socketId : 4 , userName : 'user 4 '},
  ]);
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
