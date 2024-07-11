import { View, Text } from 'react-native'
import React from 'react'
import { createContext, useState } from "react";
const userType = createContext()
const UserContext = ({ children }) => {
    const [userId, setUserId] = useState("");
    return (
        <userType.Provider value={{ userId, setUserId }}>
            {children}
        </userType.Provider>
    )
}

export { userType, UserContext };
