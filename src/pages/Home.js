import React , {useState} from 'react';
import {v4} from 'uuid';
import toast from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const roomId = v4();
        setRoomId(roomId);
        console.log(roomId);
        toast.success('New Room Created');
    };
    const joinRoom = () => {
        if(!roomId || !userName) {
            toast.error('Please enter Room Id and User Name');
            return;
        }
        //Redirect to
        navigate(`/editor/${roomId}` ,{
            state:{userName}
        });

    }
    const handelKeyUp = (e) => {
        if(e.keyCode === 13) {
            joinRoom();
        }
    }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className='homePageLogo'src="/code-sync.png " alt="code-sync-logo"/>
            <h4 className="mainLabel">Paste Invitation RoomID</h4>
            <div className="inputWrapper">
                <input 
                    type="text"
                    className="inputBox"
                    placeholder="Room Id"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyUp={handelKeyUp}
                />

                <input 
                    type="text"
                    className="inputBox"
                    placeholder="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyUp={handelKeyUp}
                />
                <button 
                    onClick={joinRoom}
                    className="btn joinBtn"
                    >
                        Join
                </button>

                <span className="createInfo">
                    If you don't have an invitation then just create a&nbsp;
                    <a 
                        onClick={createNewRoom}
                        className="createNewBtn">
                            new Room
                    </a>
                </span>
            </div>
        </div>
        <footer className="footer">
            <h4> Build with &#128155;&nbsp;by&nbsp;
                <a href="https://github.com/kingsumit011" >Github</a>
            </h4>
        </footer>
    </div>
  )
}

export default Home