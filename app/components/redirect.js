'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useEffect} from 'react';

export default function redirect({user}) {
    const router = useRouter();
    const path = usePathname();

    if(!!user && !(path == '/login' || path == '/signup' || path == '/recovery')) {
       useEffect(() => {
            router.push("/");
        }, []);
    }

    if (user && !user.emailVerified) {
        useEffect(() => {
            router.push("/signup/verify");
        }, []);
    }

    
    return (<></>);
}