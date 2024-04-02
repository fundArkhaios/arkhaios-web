import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TransferModal({ linkedAccounts }) {
  const [selectedBank, setSelectedBank] = useState(-1);
  const [transferAmount, setTransferAmount] = useState(null);

  function setValue(e) {
    setTransferAmount(e.target.value);
  }

  async function transfer() {
    if(selectedBank != -1 && transferAmount) {
      const bank = linkedAccounts[selectedBank];

      const payload = {
        institution: bank.institution_id,
        type: bank.subtype,
        amount: transferAmount,
        direction: "incoming"
      };

      await fetch("/api/account/ach-transfer", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(async (response) => {
          if (response.status === 200) {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

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

            {linkedAccounts.map((account, index) => (
              <div key={index} onClick={()=>setSelectedBank(index)} className="cursor-pointer justify-self-center mb-2 space-y-1">
                <div className={`text-center flex items-center border ${selectedBank == index ? "border-green-400" : "border-white"} p-2 text-white space-x-4 w-64`}>
                  <BuildingLibraryIcon className="h-5 w-5" />
                  <div className="w-full">
                    <p className="font-light text-xs text-right">
                      {" "}
                      {account.institution_name} ({account.name})
                    </p>
                    <p className="font-thin text-xs text-right">
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
              onChange={setValue}
              className="input input-md border border-white"
              placeholder="$100.00"
              aria-label="$100.00"
            />
          </div>
          <btn onClick={transfer} className="btn btn-lg font-light rounded-sm text-white">
            Submit
          </btn>
        </div>
      </div>
    </dialog>
  );
}
