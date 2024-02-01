'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function EnableMFA() {
    const router = useRouter();

    const [qrCode, setQrCode] = useState(null);
    const [error, setError] = useState("");
    const [enabled, setEnabled] = useState(false);
    console.log(qrCode);
    useEffect(() => {
        if(qrCode == null) {
            fetch("/api/mfa", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            }).then(async response => {
                response.json().then(data => {
                    if(data.message == "mfa already enabled") {
                        setEnabled(true);
                    }

                    if(data.status == "success") {
                        setQrCode(data.data.token);
                    }
                });
            }).catch(error => {
                console.log(error);
                throw new Error ("A server error has occurred.");
            });
        }
    }, []);

    const enableMFA = (e) => {
        e.preventDefault();
        
        fetch("/api/mfa", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({code: document.getElementById("authenticator-code").value})
        }).then(async response => {
            console.log(response);
            response.json().then(data => {
                if(data.status == "success") {
                    router.push('/account/settings/security-privacy')
                } else setError(data.message);
            });
        }).catch(error => {
            console.log(error);
            throw new Error ("A server error has occurred.");
        });
    };
    
    const disableMFA = (e) => {
        e.preventDefault();
        
        fetch("/api/mfa", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({disable: true, code: document.getElementById("authenticator-code").value})
        }).then(async response => {
            console.log(response);
            response.json().then(data => {
                if(data.status == "success") {
                    router.push('/account')
                } else setError(data.message);
            });
        }).catch(error => {
            console.log(error);
            throw new Error ("A server error has occurred.");
        });
    };

    const enable = <>
        {!qrCode ? <p>Loading...</p> :
		    <div className="m-auto w-fit rounded-md p-2 bg-base-200">
                <img className="block m-auto rounded-md" src = {qrCode}/>
                <p className="pt-2">Scan with your authenticator app</p>
            </div>
        }

        {qrCode ? 
            <form id="enableForm" onSubmit={enableMFA} className="m-auto flex flex-col justify-center max-w-sm gap-4 px-10 py-10">
            <div className="form-control">
			<label className="label" htmlFor="authenticator-code"><span className="label-text">Enter authenticator code</span></label>
			<input
				type="text"
				placeholder="code"
				className="input input-bordered bg-base-200"
				required
				id="authenticator-code" />
            </div>

            <button className="btn btn-neutral" type="submit" id="submit">
                Enable MFA
            </button>
            </form> : <></>}

        <p className="red-500">{error}</p>
    </>;

    const disable = <>
        <p className = "text-xl font-bold text-white place-self-center py-2">MFA Enabled</p>
        <form id="loginForm" onSubmit={disableMFA} className="m-auto flex flex-col justify-center max-w-sm gap-4 px-10 py-10">
        <div className="form-control">
        <label className="label" htmlFor="authenticator-code"><span className="label-text">Enter authenticator code to disable MFA</span></label>
        <input
            type="text"
            placeholder="code"
            className="input input-bordered bg-base-200"
            required
            id="authenticator-code" />
        </div>

        <button className="btn btn-neutral" type="submit" id="submit">
            Disable MFA
        </button>
        </form>

        <p className="red-500">{error}</p>
        </>;

    return (
    <main className = "text-center py-10 px-10">
        <p className = "text-2xl font-bold text-white place-self-center py-2">Multifactor Authentication</p>

        { enabled ? disable : enable}
    </main>
    );
}