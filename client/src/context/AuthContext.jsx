import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [ user, setUser ] = useState(null);
    const [ registerError, setRegisterError ] = useState(null);
    const [ isRegisterLoading, setIsRegisterLoading ] = useState(false);
    const [ loginError, setLoginError ] = useState(null);
    const [ isLoginLoading, setIsLoginLoading ] = useState(false);

    const [ registerInfo, setRegisterInfo ] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [ loginInfo, setLoginInfo ] = useState({
        email: "",
        password: ""
    });

    // console.log(user)
    // console.log(loginInfo)

    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user))
    }, [])

    // Register setRegisterInfo 
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    // login setLoginInfo
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    // register
    const registerUser = useCallback(async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }

        localStorage.setItem("User", JSON.stringify(response)) // storing user to local storate
        setUser(response); // storing user to state
    }, [registerInfo]);

    // login
    const loginUser = useCallback(async(e)=> {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        
        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response);
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo])

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider 
            value={{
                user,
                // Register user
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                // Logout user
                logoutUser,
                // login user
                loginUser,
                updateLoginInfo,
                loginError,
                loginInfo,
                isLoginLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}