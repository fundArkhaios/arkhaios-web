import { useState } from "react";
import Stepper from "./stepper.js";
import StepperControl from "./stepperControl";
import { KYCFlowContextProvider } from "./KYCFlowContext.js";

import Account from "./steps/Account";
import Contact from "./steps/Contact";
import Agreements from "./steps/Agreements.js";
import Disclosures from "./steps/Disclosures.js";
import Documents from "./steps/Documents.js";
import Final from "./steps/Final";
import './kycFlow.css'

export default function KYCForm() {

  const [currentStep, setCurrentStep] = useState(1);
  const [creationStatus, setCreationStatus] = useState({data: {success: "", message: ""}});
  const [frontID, setFrontID] = useState("");
  const [backID, setBackID] = useState("");

  const steps = [
    "Account Information",
    "Contact",
    "Disclosures",
    "Documents",
    "Agreements",
    "Final"
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <Account />;
      case 2:
        return <Contact />;
      case 3:
        return <Disclosures />;
      case 4:
        return <Documents />;
      case 5:
        return <Agreements/>;
      case 6:
        return <Final creationStatus={creationStatus}/>;
      default:
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <KYCFlowContextProvider>
    <div className="mx-auto rounded-2xl pb-2 md:w-4/5">
      {/* Stepper */}
      <div className="horizontal container mt-5 ">
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="my-10 p-5">
          {displayStep(currentStep)}
        </div>
      </div>

      {/* navigation button */}
      {currentStep !== steps.length && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          setCreationStatus={setCreationStatus}
          setBackID={setBackID}
          setFrontID={setFrontID}
        />
      )}
    </div>
    </KYCFlowContextProvider>
  );
}