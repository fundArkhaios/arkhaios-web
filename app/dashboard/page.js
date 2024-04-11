import './dashboard.css'

import TopLeft from './topLeft';
import TopRight from './topRight';
import { cookies } from "next/headers";
import authenticate from "../../util/authenticate";
import db from "../../util/db";
import BottomLeft from './bottomLeft';
import BottomRight from './bottomRight';
import MappedUsers from './mappedUsers';

export default async function Page() {
    const cookieStore = cookies();
    const email = cookieStore.get("email")?.value;
    const session = cookieStore.get("session")?.value;

    const user = await authenticate.login(email, session);

    let fund = null;
    if(user?.fundsManaging?.length > 0) {
        try {
            await db.connect(async (db) => {
                fund = await db.collection("FundPortfolios").findOne({fundID: user.fundsManaging[0]});
            });
        } catch(e) {}
    }

    if(!fund) {
        return <div>Unauthorized</div>
    }

    return (
            <div className ="h-screen overflow-x-hidden px-10 py-5">
                <div className = "grid grid-rows-3 cols-2 justify-items-center w-full gap-4">
                    <div className = "col-span-1 place-content-center"><TopLeft fund={fund}/></div>
                    <div className = "col-span-1"><TopRight fundSymbol={fund.fundSymbol} fundAvailableBalance={fund.availableBalance} fundID={fund.fundID}/></div>
                    
                    <div className = "w-full col-span-2 place-content-center">
                        <div className ="w-full divider divider-primary "></div>
                        <MappedUsers fund={fund}/>
                        <div className ="w-full divider divider-primary"></div>
                    </div>
                    <div className = "col-span-1 w-full"><BottomLeft fundID={fund.fundID}/></div>
                    <div className = "col-span-1 w-full"><BottomRight fundID = {fund.fundID}/></div>
                </div>
                
            </div>
            
    )
}