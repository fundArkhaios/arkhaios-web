import { headers } from "next/headers";
import StockChart from "../stockChart";
import PlaceStockOrder from "../placeStockOrder";
import StockNews from "../stockNews";
import CompanyPeers from "../companyPeers";

export default async function Page({ params }) {
  var quote = 0;
  let list = headers();

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  return (
    <div className="pl-12 grid grid-cols-2 pt-12">
      <div className="justify-self-center max-w-7xl pl-10">
        <StockChart symbol={params.id} />
      </div>
      <div className="justify-self-end pr-10 max-w-2xl">
        <PlaceStockOrder symbol={params.id} />
      </div>
      <div classnName="justify-self-center">
        <p className="font-bold">{params.id.toUpperCase() + " "}News</p>
        <StockNews symbol={params.id} />
      </div>
      <div className="justify-self-end pr-10 max-w-2xl">
        <CompanyPeers symbol={params.id} />
      </div>
    </div>
  );
}
