import { View, Text } from 'react-native'
import React from 'react'
import { createContext, useState } from "react";
const userType = createContext()
const UserContext = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    return (
        <userType.Provider value={{ userId, setUserId, userName, setUserName, userImage, setUserImage }}>
            {children}
        </userType.Provider>
    )
}

export { userType, UserContext };
