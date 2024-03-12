export default function PlaceStockOrder ({symbol}) {
  return (
    <div>
      <div className="w-72 h-96 rounded-sm border border-gray-300 ">
        <div className="border-b border-amber-200 px-2">
          <div className="grid grid-cols-2 px-1 py-2">
            <p className="text-amber-100 font-light">Trade {symbol.toUpperCase()}</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
