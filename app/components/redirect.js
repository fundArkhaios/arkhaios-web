'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useEffect} from 'react';

export default function redirect({user}) {
    const router = useRouter();
    const path = usePathname();

    useEffect( () => {
        if(!!user && !(path == '/login' || path == '/signup' || path == '/recovery')) {
            router.push("/");
        }
    }, [])
    

    useEffect(() => {
        if (user && !user.emailVerified && !(path == '/signup/verify')) {
            console.log("Hello")
            console.log("Counter " + console.count('Count'))
            router.push("/signup/verify");
        }
    }, []);

    
    return (<></>);
}