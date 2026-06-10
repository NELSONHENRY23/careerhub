import { createContext, useState, useEffect } from "react"; 

export const AuthContext = createContext();

export default function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Load from localStorage and set user and token if they exist on refresh
    useEffect(() => {
        const storedUser  = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (data) => {
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

    }

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');   
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}