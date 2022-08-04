import { createContext  } from "react";

import useAuth from "../hooks/useAuth";

const Context = createContext()

function UserProvider({ children }) {
   
    const { authenticadet, register, logout, login } = useAuth()

    return(
        <Context.Provider value={{ authenticadet, register, logout, login }}>
            { children }
        </Context.Provider>
    )
}

export {Context, UserProvider}