'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useEffect} from 'react';

export default function redirect({authenticated}) {
    const router = useRouter();
    const path = usePathname();

    if(!authenticated && !(path == '/login' || path == '/register')) {
       useEffect(() => {
            router.push("/");
        }, []);
    }

    return (<></>);
}