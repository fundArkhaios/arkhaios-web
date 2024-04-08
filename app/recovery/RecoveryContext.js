"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import Link from "next/link";
import "../../output.css";
import "../globals.css";
import "./../components/components.css";

export const RecoveryContext = createContext();

export const RecoveryContextProvider = ({ children }) => {
  // Component Pages set to be displayed in the recovery flow process.
  const [sendEmailPage, setSendEmailPage] = useState(true);
  const [codeRecoveryPage, setCodeRecoveryPage] = useState(false);
  const [newPasswordPage, setNewPasswordPage] = useState(false);
  const [email, setEmail] = useState("");
  // Error Pop-ups that will be introduced if the user enters the wrong email or recovery code.
  const [emailError, setEmailError] = useState(false);
  const [recoveryCodeError, setRecoveryCodeError] = useState(false);
  const [passwordRecoveryError, setPasswordRecoveryError] = useState(false);

  // Success Pop-up
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  // Make sure the passwords are the same.
  const [samePassword, setSamePassword] = useState("");

  // Loading Wheel
  const [isLoading, setIsLoading] = useState(false);

  async function sendRecoveryCode(event) {
    setIsLoading(true);
    event.preventDefault();
    await fetch("/api/account/send-recovery-code", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.getElementById("email").value,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.error == "") {
          setEmail(document.getElementById("email").value);
          setSendEmailPage(false);
          setCodeRecoveryPage(true);
        } else if (data.error == "Account does not exist.") {
          setEmailError(true);
        } else {
          throw new Error("Invalid Email");
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("A server error has occurred.");
      })
      .finally(() => {
        // Stop the loading regardless of the response. It just matters we have a response.
        setIsLoading(false);
      });
  }

  useEffect(() => {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }, [
    sendEmailPage,
    codeRecoveryPage,
    newPasswordPage,
    recoveryCodeError,
    passwordRecoveryError,
  ]);

  async function checkRecoveryCode(event) {
    setIsLoading(true);
    console.log("Inside of Check Recovery Code function!");
    event.preventDefault();
    await fetch("/api/checkRecoveryCode", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        recoveryCode: document.getElementById("recoveryCode").value,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.error == "") {
          setNewPasswordPage(true);
          setCodeRecoveryPage(false);
        } else if (data.error == "No match") {
          setRecoveryCodeError(true);
        } else {
          throw new Error("What the hell has happened!?");
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("A server error has occured.");
      }).finally( () => {
        setIsLoading(false);
      });
  }

  async function resetPassword(event) {
    setIsLoading(true);
    event.preventDefault();
    await fetch("/api/resetPassword", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: document.getElementById("recoveryPassword").value,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.status == "success") {
          setTimeout(setPasswordResetSuccess(true), 3000);
          window.location.href = "/";
          //setNewPasswordPage(false); // Not needed.
        } else if (data.status == "failed") {
          setPasswordRecoveryError(true);
        } else {
          throw new Error("What the hell has happened!?");
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("A server error has occured.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function verifyRecoveryPassword() {
    setSamePassword(document.getElementById("recoveryPassword").value);
  }

  const renderPasswordResetSuccess = () => {
    if (passwordResetSuccess) {
      return (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Code does not match.</span>
        </div>
      );
    }
  };

  const renderCodeRecoveryError = () => {
    if (recoveryCodeError) {
      return (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Code does not match.</span>
        </div>
      );
    }
  };

  const renderEmailError = () => {
    if (emailError) {
      return (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0  24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Account does not exist!</span>
        </div>
      );
    }
  };

  const renderPasswordRecoveryError = () => {
    if (passwordRecoveryError) {
      return (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Password reset unsuccessful.</span>
        </div>
      );
    }
  };

  // This commponent will render the 1 input text form alongside
  // the submit button. It will make a request to the /sendRecoveryCode API
  // which will of course send a recovery code to the entered email.
  const emailComponent = () => {
    return (
      <form
        id="recovery"
        onSubmit={sendRecoveryCode}
        className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
      >
        {renderEmailError()}

        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            id="email"
          />
        </div>
        {isLoading ? (
          <button className="btn btn-neutral buttonLoader cursor-progress" type="submit" id="submit">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </button>
        ) : (
          <button className="btn btn-neutral" type="submit" id="submit">
            Send Recovery Email
          </button>
        )}

        <div className="label justify-end">
          <Link href="/signup" className="link-hover link label-text-alt">
            Create new account
          </Link>
        </div>
      </form>
    );
  };

  // This component will ask the user for the code that was previously sent to their email.
  // After
  const codeRecoveryComponent = () => {
    return (
      <form
        id="checkRecoveryCode"
        onSubmit={checkRecoveryCode}
        className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
      >
        {renderCodeRecoveryError()}
        <div className="form-control">
          <label className="label" htmlFor="recoveryCode">
            <span className="label-text">Recovery Code</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            min="5"
            id="recoveryCode"
          />
        </div>
        {isLoading ? (
          <button className="btn btn-neutral buttonLoader cursor-progress" type="submit" id="submit">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </button>
        ) : (
        <button className="btn btn-neutral" type="submit" id="submit">
          Submit Recovery Code
        </button>
        ) }
        <div className="label justify-end">
          <Link href="/signup" className="link-hover link label-text-alt">
            Create new account
          </Link>
        </div>
      </form>
    );
  };

  // This component will ask the user to enter a new password and to verify their new password.
  // The form will not be allowed to submitted if both passwords are not the same and have not met some regex criteria.
  // On submit will trigger the API to change their password in our database and return them to the login page.
  const newPasswordComponent = () => {
    return (
      <form
        id="resetPassword"
        onSubmit={resetPassword}
        className="flex flex-col justify-center gap-4 px-10 py-6 lg:px-16"
      >
        {renderPasswordRecoveryError()}
        {renderPasswordResetSuccess()}
        <div className="form-control">
          <label className="label" htmlFor="input2">
            <span className="label-text">Reset Password</span>
          </label>
          <input
            pattern={samePassword}
            type="password"
            id="recoveryPassword"
            placeholder="password"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            minLength="6"
            onChange={verifyRecoveryPassword}
          />
        </div>

        <div className="form-control">
          {/* <label className="label" htmlFor="input2"><span className="label-text">Password</span></label> */}
          <input
            type="password"
            id="passwordConfirm"
            pattern={samePassword}
            placeholder="confirm password"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            minLength="6"
            onChange={verifyRecoveryPassword}
          />
        </div>
        {isLoading ? (
          <button className="btn btn-neutral buttonLoader cursor-progress" type="submit" id="submit">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </button>
        ) :
        (<button className="btn btn-neutral" type="submit" id="submit">
          Reset
        </button>)
        }
      </form>
    );
  };

  const value = {
    sendEmailPage,
    setSendEmailPage,
    codeRecoveryPage,
    setCodeRecoveryPage,
    newPasswordPage,
    setNewPasswordPage,
    emailError,
    setEmailError,
    recoveryCodeError,
    setRecoveryCodeError,
    emailComponent,
    codeRecoveryComponent,
    newPasswordComponent,
  };

  return (
    <RecoveryContext.Provider value={value}>
      {children}
    </RecoveryContext.Provider>
  );
};

export default RecoveryContext;
