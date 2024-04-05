import { HomeIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function MessageChat({ friendSelected }) {

  



  return (
    <div className="relative h-full">
      <p>Message Chat History {friendSelected.firstName}</p>
      <div className="absolute inset-x-0 left-0 bottom-0 h-16 p-2  border-t-2 border-slate-500">
        <div className=  "flex">
          <input
            className="focus:outline-none w-11/12 px-1 text-white bg-[#121212]"
            placeholder="Send a message..."
          />
          <button className="w-1/12 pl-5">
            <PaperAirplaneIcon className="h-5 w-5 items-center" />
          </button>
        </div>
      </div>
    </div>
  );
}
