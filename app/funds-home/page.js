import { cookies } from "next/headers";
import authenticate from "../../util/authenticate";

import CreateFund from './CreateFund'
import ManageFund from './ManageFund'
import db from "../../util/db";

export default async function Page() {
    const cookieStore = cookies();
    const email = cookieStore.get("email")?.value;
    const session = cookieStore.get("session")?.value;

    const user = await authenticate.login(email, session);

    let creationEligible = true;
    let fund = null;
    if(user?.fundsManaging?.length > 0) {
        creationEligible = false;
        try {
            await db.connect(async (db) => {
                fund = await db.collection("FundPortfolios").findOne({fundID: user.fundsManaging[0]});
            });
        } catch(e) {}
    }

    return creationEligible ? (
        <div className="flex min-h-screen items-center justify-center bg-base-200">
            <div className="m-4 min-h-[50vh] w-full max-w-sm lg:max-w-4xl">
                <CreateFund/>
            </div>
        </div>
        ) : <ManageFund fund={{
            fundID: fund.fundID,
            fundSymbol: fund.fundSymbol,
            fundName: fund.fundName,
            fundBalance: fund.availableBalance
        }}/>;
}