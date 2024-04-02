import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

import { useState, useEffect } from "react";
import TransferModal from "./transferModal";

export default function PlaidLinkComponent() {
  const [linkToken, setLinkToken] = useState();
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  function fetchBankAccounts() {
    return fetch("/api/plaid/banks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  function fetchTransfers() {
    return fetch("/api/account/get-transfers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  async function transferPlaidLink(publicToken, metadata) {
    await fetch("/api/plaid/public-token-exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_token: publicToken,
        metadata: metadata,
      }),
    });
  }

  useEffect(() => {
    fetchBankAccounts().then(async (response) => {
      const data = await response.json();
      setLinkedAccounts(data.data.banks.flat());
    });

    fetchTransfers().then(async (response) => {
      const data = await response.json();
      setTransfers(data.data);
    })

    async function generateLinkToken() {
      await fetch("/api/plaid/generate-link-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        console.log("Data: " + data);
        console.log(data.stringify);
        setLinkToken(data.link_token);
      });
    }
    generateLinkToken();
  }, []);

  var config = {
    onSuccess: function (publicToken, metadata) {
      console.log("SUCCESS PLAID");
      console.log(metadata);
      transferPlaidLink(publicToken, metadata);
    },
    onExit: function (err, metadata) {
      console.log("EXITED PLAID");
    },
    onEvent: function (eventName, metadata) {
      console.log("EVENT PLAID");
    },
    token: linkToken,
  };

  const { open, exit, ready } = usePlaidLink(config);

  return (
    <div className="text-white">
      <div className="space-y-5">
        <div>
          <p className="py-2 text-xl text-light">Start a Transfer </p>
          <btn className="btn btn-sm  font-light outline rounded-sm text-white" onClick={() =>
                      document.getElementById("transferModal").showModal()
                    }>
            Money Transfer
            <ArrowsRightLeftIcon className="h-6 w-6" />
          </btn>
          <TransferModal linkedAccounts={linkedAccounts}/>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-2 space-y-2">
            <div className="flex flex-row space-x-4 pb-10">
              <p className="text-xl">Linked Accounts</p>
              <btn
                className="cursor-pointer text-emerald-400 self-center hover:underline underline-offset-4"
                onClick={open}
              >
                Add Account
              </btn>
            </div>
            {
            linkedAccounts?.length ?
            linkedAccounts.map((account) => (
              <div key={account.key} className="space-y-4">
                <div className="grid grid-cols-2 justify-items-start border p-2 text-white w-1/2">
                  <BuildingLibraryIcon className="h-10 w-10" />
                  <div className="w-full">
                    <p className="font-light text-right"> {account.institution_name} ({account.name})</p>
                    <p className="font-thin text-right"> {account.subtype} ({account.mask})</p>
                  </div>
                </div>
              </div>
            ))
            :
            <p>No Bank Accounts...</p>
          }
          </div>

          <div className="space-x-4 pb-10">
            <p className="text-xl">Transfers</p>
            {
              transfers.map((transfer) => {
                return (
                  <div className="flex mb-2 flex-row items-center w-full">
                    <span>
                      <p className="text-lg">{transfer.direction == "INCOMING" ? "Deposit" : "Withdrawal"} of ${transfer.amount} {transfer.currency}</p>
                      <p className="text-sm">Status: {transfer.status.slice(0, 1).toUpperCase()}{transfer.status.slice(1).toLowerCase().replace("_", " ")}</p>
                      <p className="text-thin text-xs text-slate-300">{new Date(transfer.created_at).toLocaleString()}</p>
                    </span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
