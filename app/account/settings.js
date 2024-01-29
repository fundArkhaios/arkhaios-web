'use client';

import {useState} from 'react';
import Link from 'next/link';

export default function Settings() {

    return (<>
    <p className="text-white">Account Security</p>
    <Link href="/account/mfa">
        <button className="btn btn-neutral" type="submit" id="submit">
            Manage MFA
        </button>
    </Link>
    </>);
}