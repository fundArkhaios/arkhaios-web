import { cookies, headers } from 'next/headers';
import authenticate from '../../util/authenticate';
import AccountHeader from './accountHeader';


export default async function RootLayout ({ children }) {
    


    const path = headers().get("x-url");
    const cookieStore = cookies();
    const email = cookieStore.get('email')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(email, session);


    return (
        <main className = "text-center py-6 px-10">
            <p className = "text-5xl font-bold text-white place-self-center py-2 drop-shadow-lg">{user.firstName + " " + user.lastName} </p>
            <p className ="pb-5 text-sm text-amber-100">{user.username}</p>
            <AccountHeader/>
            {children}
        </main>
    )

}