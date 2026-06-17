import { useState } from "react";
import { AuthContext } from "./AuthContext";

const disableAuth = import.meta.env.VITE_DISABLE_AUTH === "true";

const devUser = {
    _id: "000000000000000000000001",
    name: "Dev Admin",
    email: "dev@junubhire.local",
    role: "admin", 
}

export default function AuthProvider({children}){
    const [user, setUser] = useState(() => {
        if(disableAuth) return devUser;

        const storedUser = localStorage.getItem('user');

        if(!storedUser) return null;

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Failed to parse stored user: ", error);
            localStorage.removeItem('user');
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        if(disableAuth) return "dev-token";

        return localStorage.getItem('token');
    })

    const login = (data) => {
        if(disableAuth) return;

        setUser(data.user);
        setToken(data.token);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
    }

    
    const updateUser = (updatedUser) => {
      if (disableAuth) return;
  
      setUser((prevUser) => {
        const nextUser = {
          ...prevUser,
          ...updatedUser,
        };
  
        localStorage.setItem("user", JSON.stringify(nextUser));
        return nextUser;
      });
    };

    const logout = () => {
        if(disableAuth) return;
        
        setUser(null);
        setToken(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}