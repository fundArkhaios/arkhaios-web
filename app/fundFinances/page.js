import { cookies } from "next/headers";
import authenticate from "../../util/authenticate";
import db from "../../util/db";
import PMFundChart from "./pmFundChart";
import FundPositions from "./fundPositions";
import FundOrders from "./fundOrders";

export default async function Page() {
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const session = cookieStore.get("session")?.value;

  const user = await authenticate.login(email, session);

  let fund = null;
  if (user?.fundsManaging?.length > 0) {
    try {
      await db.connect(async (db) => {
        fund = await db
          .collection("FundPortfolios")
          .findOne({ fundID: user.fundsManaging[0] });
      });
    } catch (e) {}
  }

  if (!fund) {
    return <div>Unauthorized</div>;
  }

  return (
    <>
      <div className="grid grid-rows-2 self-stretch place-content-center gap-5 p-10">
        <div className="w-full justify-center justify-self-center text-center">
          <PMFundChart fundSymbol={fund.fundSymbol}/>
        </div>
        <div className="grid grid-cols-2 place-content-center justify-between gap-5">
          <div className="">
            <FundPositions fundID={fund.fundID}/>
          </div>
          <div className="">
            <FundOrders className = "bg-[#121212]" fundID={fund.fundID}/>
          </div>
        </div>
      </div>
    </>
  );
}
