import { cookies } from "next/headers";
import authenticate from "../../util/authenticate";

import CreateFund from './CreateFund'

export default async function Page() {
    const cookieStore = cookies();
    const email = cookieStore.get("email")?.value;
    const session = cookieStore.get("session")?.value;

    const user = await authenticate.login(email, session);

    let creationEligible = true;
    if(user?.fundsManaging?.length > 0) {
        creationEligible = false;
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="m-4 min-h-[50vh] w-full max-w-sm lg:max-w-4xl">
            {
            creationEligible ? <CreateFund/> : <div>Manage your fund...</div>
            }
        </div>
    </div>
    );

}