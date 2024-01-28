import authenticate from "../../util/authenticate";
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers'

export default async function Page() {
    
    const cookieStore = cookies();
    const email = cookieStore.get('email')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(email, session);

    // Testing
    return (
    <main className = "text-center py-10 px-10">
        <p className = "text-5xl font-bold text-white place-self-center py-2">{user.firstName + " " + user.lastName}</p>
        <p className ="pb-5 text-sm"> {user.username}</p>
        <div className = "flex col-1 px-10 pt-5 justify-center space-x-16 text-xl">
            <p className = "text-white">Investing</p>
            <p>Transfers</p>
            <p>Reports & Statements</p>
            <p>Settings</p>
            <p>Help</p>
        </div>
    </main>
    
    
    );

}