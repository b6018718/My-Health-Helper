import React from 'react'

/*
Allows the socket to be exported so that
only one socket is used per application
*/

const SocketContext = React.createContext()

export default SocketContext