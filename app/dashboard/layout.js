export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-row justify-between px-20 py-2 border-b border-amber-200">
        <button className = "btn btn-sm bg-slate-100 p-1 hover:bg-slate-200 text-black rounded-lg">Dashboard</button>
        <button className = "btn btn-sm bg-slate-100 p-1 hover:bg-slate-200 text-black rounded-lg">Financials</button>
        <button className = "btn btn-sm bg-slate-100 p-1 hover:bg-slate-200 text-black rounded-lg">Settings</button>
      </div>
      {children}
    </>
  );
}
