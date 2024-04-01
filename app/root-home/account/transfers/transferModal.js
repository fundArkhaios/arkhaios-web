import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

export default function TransferModal({ linkedAccounts }) {
  return (
    <dialog id="transferModal" className="modal">
      <div className="modal-box w-5/12 h-1/2 max-w-5xl grid justify-center">
        {/* if there is a button in form, it will close the modal */}
        <button
          onClick={() => document.getElementById("transferModal").close()}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <div className="text-center space-y-10">
          <div className="text-center">
            <p className="pb-2">Select a Bank</p>

            {linkedAccounts.map((account) => (
              <div key={account.key} className="justify-self-center space-y-1">
                <div className="text-center grid grid- grid-cols-2 border p-2 text-white space-x-4 w-64">
                  <BuildingLibraryIcon className="h-5 w-5 justify-self-center" />
                  <div className="justify-self-start">
                    <p className="font-light text-xs">
                      {" "}
                      {account.institution_name} ({account.name})
                    </p>
                    <p className="font-thin text-xs">
                      {" "}
                      {account.subtype} ({account.mask})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="Amount"
              className="block text-sm font-medium text-white py-1 justify-self-start"
            >
              Deposit Amount
            </label>
            <input
              className="input input-md border border-white"
              placeholder="$100.00"
              aria-label="$100.00"
            />
          </div>
          <btn className="btn btn-lg font-light rounded-sm text-white">
            Submit
          </btn>
        </div>
      </div>
    </dialog>
  );
}
