import { useState } from "react";
import { useKYCFlowContext } from "../KYCFlowContext";

export default function Agreements() {
  const { userData, setUserData } = useKYCFlowContext();

  const [accountLinkClicked, setAccountLinkClicked] = useState(false);
  const [marginLinkClicked, setMarginLinkClicked] = useState(false);

  function handleAccountClick() {

    setAccountLinkClicked(true);
  }

  function handleMarginClick() {
    setMarginLinkClicked(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => {
      const newData = { ...prevState, [name]: value };
      return newData;
    });
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full mx-2 space-y-5">
        <div className="flex space-x-2 self-center">
          <a
            name="account_agreement"
            href="https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAccountClick}
            className="hover:underline self-center text-sm"
          >
            Alpaca Account Agreement
          </a>
          <div className="form-control self-center">
            <label className="label cursor-pointer gap-x-2">
              <input
                type="checkbox"
                name="account_agreement"
                onClick={handleChange}
                className="checkbox checkbox-info"
                disabled={!accountLinkClicked}
              />
            </label>
          </div>
          <a className="self-center text-xs">
            I, the undersigned, acknowledge and accept the terms and conditions
            outlined in this document.
          </a>
        </div>
        <div className="flex space-x-2 self-center">
          <a
            name="margin_agreement"
            href="https://files.alpaca.markets/disclosures/library/AcctAppMarginAndCustAgmt.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMarginClick}
            className="hover:underline self-center text-sm"
          >
            Margin Account Agreement
          </a>
          <div className="form-control self-center">
            <label className="label cursor-pointer gap-x-2">
              <input
                type="checkbox"
                name="margin_agreement"
                onClick={handleChange}
                className="checkbox checkbox-info"
                disabled={!marginLinkClicked}
              />
            </label>
          </div>
          <a className="self-center text-xs">
            I, the undersigned, acknowledge and accept the terms and conditions
            outlined in this document.
          </a>
        </div>
      </div>
    </div>
  );
}
