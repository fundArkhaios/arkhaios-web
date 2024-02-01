'use client'
import { createContext } from 'react';


export const UserContext = createContext();

export const UserContextProvider = ( {children, user} ) => {

    
    console.log(user.username);
    // var value = { "user" : user};

    var value = {
        "user": user
    }


    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>

    )
}

export default UserContext;


