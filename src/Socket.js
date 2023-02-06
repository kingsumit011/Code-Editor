import {io} from 'socket.io-client'


export const initSocket = async () => {
    const option ={
        transports: ['websocket'],
        'force new connection': true,
        'reconnectionAttempts': 'Infinitty',
        'timeout': 10000,
    }
    return io(process.env.REACT_APP_BACKEND_URL, option)
}