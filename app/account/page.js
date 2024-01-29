import authenticate from "../../util/authenticate";
import { cookies } from 'next/headers'
import Account from './component';

export default async function Page() {
    const cookieStore = cookies();
    const email = cookieStore.get('email')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(email, session);

    return (
    <main className = "text-center py-10 px-10">
        <p className = "text-5xl font-bold text-white place-self-center py-2">{user.firstName + " " + user.lastName}</p>
        <p className ="pb-5 text-sm"> {user.username}</p>
        <Account/>
    </main>
    );

}