import { useKYCFlowContext } from "./KYCFlowContext";
import "./kycFlow.css";

export default function StepperControl({ handleClick, currentStep, steps }) {
  const { userData, setUserData } = useKYCFlowContext();

  console.log("StepperControl Refresh UserData: " + JSON.stringify(userData));



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

    await fetch("/api/kyc", {

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
        onClick={() => handleClick()}
        className={`cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2 px-4 font-semibold uppercase text-slate-400 transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white  ${
          currentStep === 1 ? " cursor-not-allowed opacity-50 " : ""
        }`}
      >
        Back
      </button>

      {currentStep === steps.length - 1 ? (
        <button
          onClick={() => {handleClick("next"); createAccount()}}
          className="cursor-pointer rounded-lg bg-green-500 py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white"
        >
          Confirm
        </button>
      ) : (
        <button
          onClick={() => handleClick("next")}
          className="cursor-pointer rounded-lg bg-green-500 py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white"
          /* disabled={userData.is_control_person == "true" ? "no" : "yes"} */
        >
          {currentStep === steps.length - 1 ? "Confirm" : "Next"}
        </button>
      )}
    </div>
  );
}
