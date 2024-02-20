import { headers } from "next/headers";
import StockChart from "../../../components/stockChart";

export default async function Page({ params }) {
  var quote = 0;
  let list = headers();

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  console.log("HELLO");
  console.log(params.id);

  console.log(quote);
  return (
    <div className = "grid grid-cols-2">
      
      <div className="text-white">
        <div>HI</div>
        <div>WORK</div>
        <div>Quote Price: {quote}</div>
        <div>{params.id}</div>
        <StockChart symbol={params.id} />
      </div>
      <div> Stock Information</div>
    </div>
  );
}
