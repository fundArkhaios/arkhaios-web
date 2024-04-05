import { headers } from "next/headers";
import FundChart from "../fundChart";
import JoinFund from "../joinFund";
import db from "../../../../util/db";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default async function Page({ params }) {
  let fund = null;

  try {
    await db.connect(async (db) => {
      fund = await db.collection('FundPortfolios').findOne({
        "fundSymbol": params.id.toUpperCase() 
      });
    });
  } catch(e) {}

  console.log(fund);
  if(!fund) {
    return (
    <div className="pl-12 grid grid-cols-2 pt-12">
      <div className="justify-self-center max-w-5xl pl-10">
        <div className = "text-5xl font-light text-center text-white">No fund by symbol: {params.id.toUpperCase()}</div>
      </div>
    </div>);
  } else {
    const divisor = fund.disbursementType.indexOf("/");
    const disbursementBase = fund.disbursementType.substring(0, divisor);
    const disbursementBonus = fund.disbursementType.substring(divisor + 1);
    const disbursementTip = `A disbursement period of ${fund.disbursementType} means that after every term, a base fee of ${disbursementBase}% will be taken, while ${disbursementBonus}% of profits will be taken only if profits exceed 8%.`;
  return (
      <>
      <div className="pl-12 grid grid-cols-2 pt-12">
        <div className="justify-self-center max-w-5xl pl-10">
          <div className = "text-5xl font-light text-white">{fund.fundName}</div>
          <div className = "text-3xl font-light text-slate-200">{fund.fundSymbol}</div>
          <FundChart symbol={params.id} />
        </div>
        <div className="justify-self-end pr-10 max-w-2xl">
          <JoinFund symbol={params.id}/>
        </div>
      </div>

    <div className="pl-12 grid grid-cols-2 pt-12">
      <div className="">
        <p className="text-white text-2xl">Summary</p>
        <div>
          <p className="font-light text-white text-lg">{fund.fundDescription}</p>
        </div>
      </div>
    </div>

    <div className="pl-12 grid grid-cols-2 pt-12">
      <div className="">
        <p className="text-white text-2xl">Terms & Conditions</p>
        <div className="flex">
          <p className="text-white text-lg mr-1">Term:</p>
          <p className="text-slate-200 text-lg">{fund.fundDisbursementPeriod.slice(0,1).toUpperCase()}{fund.fundDisbursementPeriod.slice(1)}</p>
        </div>

        <div className="flex items-center">
          <p className="text-white text-lg mr-1">Distribution Fee:</p>
          <p className="text-slate-200 text-lg">{fund.disbursementType}</p>
          <div className="tooltip" data-tip={disbursementTip}>
            <InformationCircleIcon className="mx-2 h-5 w-5"/>
          </div>
        </div>

        <div>WITHDRAW WIDGET</div>

        <div>DEPOSIT WIDGET</div>

      </div>
    </div>
    </>
    );
  }
}