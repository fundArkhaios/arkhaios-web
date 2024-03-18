import { useKYCFlowContext } from "./KYCFlowContext";
import "./kycFlow.css";

export default function StepperControl({ handleClick, currentStep, steps }) {
  const { userData, setUserData } = useKYCFlowContext();

  console.log("StepperControl Refresh UserData: " + JSON.stringify(userData));

  function shouldDisableNextButton(step, userData) {
    const stepCriteria = {
      1: ["first_name", "last_name", "dob", "ssn"],
      2: ["phone", "address", "address_unit", "postal_code", "state", "city"],
      3: ["is_control_person", "is_affiliated", "is_pep", "is_family_exposed"],
    };

    const fieldsToCheck = stepCriteria[step];
    if (fieldsToCheck) {
      return fieldsToCheck.some(field => 
        step !== 3 ? !userData[field] : userData[field] === "true"
      );
    }
    return false;
  }

  function shouldDisableConfirmButton(userData) {
    // Check previous step criteria
    if (shouldDisableNextButton(1, userData) ||
        shouldDisableNextButton(2, userData) ||
        shouldDisableNextButton(3, userData)) {
      return true;
    }
    // Check for 'account_agreement'
    return userData.account_agreement !== "on";
  }

  async function createAccount() {

    const updatedUserData = await new Promise((resolve) => {
    setUserData((prevState) => {
      const newData = { ...prevState, country: "USA" };
      console.log("Updated userData for sending: " + JSON.stringify(newData));
      resolve(newData); // Resolve the promise with the new data
      return newData;
    });
  });
  
  
    console.log("Sending userData: " + JSON.stringify(updatedUserData));
  
    await fetch("/api/account/kyc", {
  
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData)
    }).then(async (response) => {
      const data = await response.json();
      
    }).catch( (error) => {
      console.log(error);
      throw new Error("Server Error has occured.")
    }).finally( () => {
      // Something
    })
  }

  return (
    <div className="container mt-4 mb-8 flex justify-around">
      <button
        onClick={() => handleClick("prev")}
        className={`cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2 px-4 font-semibold uppercase text-slate-400 transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white  ${
          currentStep === 1 ? " cursor-not-allowed opacity-50 " : ""
        }`}
        disabled={currentStep === 1}
      >
        Back
      </button>

      {currentStep === steps.length - 1 ? (
        <button
          onClick={() => {handleClick("next"); createAccount()}}
          className="cursor-pointer rounded-lg bg-green-500 py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white"
          disabled={shouldDisableConfirmButton(userData)}
        >
          Confirm
        </button>
      ) : (
        <button
          onClick={() => handleClick("next")}
          className={`cursor-pointer rounded-lg bg-green-500 py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white ${
            shouldDisableNextButton(currentStep, userData) ? " cursor-not-allowed opacity-50 " : ""
          }`}
          disabled={shouldDisableNextButton(currentStep, userData)}
        >
          Next
        </button>
      )}
    </div>
  );
}