"use client";

import UserContext from "../../../UserContext.js";
import { useContext } from "react";
import KYCForm from "./KYCFormFlow/kycForm.js";
import { useUserContext } from "../../../UserContext.js";

export default function Page() {


  const { user } = useContext(UserContext);

  return (
    <div className="grid grid-cols-1 py-10">
      <div className="text-center justify-self-center ">
        {!user.kycVerified ? (
          <>
            <div className="card bg-error text-error-content">
              <div className="card-body">
                <h2 className="card-title">Verify Account!</h2>
                <p>
                  You need to verify this account to access any trading
                  features.
                </p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }
                    className="btn"
                  >
                    Start now
                  </button>
                </div>
              </div>
            </div>

            <dialog id="my_modal_3" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                {/* if there is a button in form, it will close the modal */}
                <button
                  onClick={() => document.getElementById("my_modal_3").close()}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                <KYCForm />

              </div>
            </dialog>
          </>
        ) : (
          <>You already have a verified account!</>
        )}
      </div>
    </div>
  );
}
