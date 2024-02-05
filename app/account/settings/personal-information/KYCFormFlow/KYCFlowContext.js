import { createContext, useContext, useState } from "react";





const StepperContext = createContext({
  userData: { is_control_person: "false",
              is_affiliated: "false",
              is_pep:"false",
              is_family_exposed:"false"},
  setUserData: () => {} // Provide a noop function as the default for setUserData
});

export function KYCFlowContextProvider({ children }) {
  const [userData, setUserData] = useState({ is_control_person: "false" });



  return (
    <StepperContext.Provider value={{ userData, setUserData }}>
      {children}
    </StepperContext.Provider>
  );
}

export function useKYCFlowContext() {
  const { userData, setUserData } = useContext(StepperContext);

  return { userData, setUserData };
}