import { headers } from "next/headers";
import FundChart from "../fundChart";
import JoinFund from "../joinFund";
import db from "../../../../util/db";

import FundStats from "../fundStats";
import FundDeposit from "../fundDeposit";

export default async function Page({ params }) {
  let fund = null;
  let announcements = [];

  try {
    await db.connect(async (db) => {
      fund = await db.collection("FundPortfolios").findOne({
        fundSymbol: params.id.toUpperCase(),
      });

      if (fund && fund.fundID) {
        console.log("get announcements");
        announcements = await db.collection("FundAnnouncements").findOne({
          fundID: fund.fundID,
        });

        if (announcements?.announcements)
          announcements = announcements.announcements;
      }
    });
  } catch (e) {}

  if (!fund) {
    return (
      <div className="pl-12 grid grid-cols-2 pt-12">
        <div className="justify-self-center max-w-5xl pl-10">
          <div className="text-5xl font-light text-center text-white">
            No fund by symbol: {params.id.toUpperCase()}
          </div>
        </div>
      </div>
    );
  } else {
    const divisor = fund.disbursementType.indexOf("/");
    const disbursementBase = fund.disbursementType.substring(0, divisor);
    const disbursementBonus = fund.disbursementType.substring(divisor + 1);
    const disbursementTip = `A disbursement period of ${fund.disbursementType} means that after every term, a base fee of ${disbursementBase}% will be taken, while ${disbursementBonus}% of profits will be taken only if profits exceed 8%.`;
    return (      
      <div className="h-screen pl-12 grid grid-cols-2 py-12">
        <div className="justify-self-center max-w-7xl pl-10">
          <div className="text-5xl font-light text-white">{fund.fundName}</div>
          <div className="text-xl font-thin text-cyan-400 py-2">
            $F: {fund.fundSymbol}
          </div>
          <div className="text-xl font-light text-slate-200">
            Stage: {fund.fundRecruiting ? "Recruiting" : "Trading"}
          </div>
          <FundChart symbol={params.id} />
        </div>
        <div className="justify-self-end pr-10 max-w-2xl">
          <JoinFund
            symbol={params.id}
            members={fund.members}
            inJournals={fund.inJournals}
            completedJournals={fund.completedJournals}
            requests={fund.memberRequests}
            fundID={fund.fundID}
          />
        </div>
        <div className="justify-self-center w-full pb-14">
          <FundStats
            fund={fund}
            disbursementTip={disbursementTip}
            announcements={announcements}
            desc={fund.fundDescription}
            
          />
        </div>
      </div>
    );
  }
}
