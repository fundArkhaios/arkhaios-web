import { headers } from "next/headers";
import StockChart from "../stockChart";
import PlaceStockOrder from "../placeStockOrder";

export default async function Page({ params }) {
  var quote = 0;
  let list = headers();

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  return (
    <div className="pl-12 grid grid-cols-2 pt-12">
      <div className="justify-self-center max-w-5xl pl-10">

        <div className = "text-5xl font-light text-white">{params.id.toUpperCase()}</div>
        <StockChart symbol={params.id} />
      </div>
      <div className="justify-self-end pr-10 max-w-2xl">
        <PlaceStockOrder symbol={params.id}/>
      </div>
    </div>
  );
}
