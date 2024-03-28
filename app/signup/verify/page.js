'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";

import { RESPONSE_TYPE } from '../../../api/response_type';

export default function Page() {
  
  
const [isLoading, setIsLoading] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const [verificationResponse, setVerificationResponse] = useState();
  const [verificationErrorMSG, setVerificationErrorMSG] = useState();

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  async function verify(event) {
    setIsLoading(true);
    event.preventDefault();
    const response = await fetch("/api/account/verify", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verificationCode: document.getElementById("verificationCode").value,
      }),
    }).then(async (response) => {
      const data = await response.json();
      setVerificationResponse(data.message);
      if (data.status == RESPONSE_TYPE.SUCCESS) {
        window.location.href = "/home";
      } else if (data.status == RESPONSE_TYPE.FAILED) {
        setVerificationErrorMSG(true);
      }
    });
    setIsLoading(false);
  }

  async function resendVerify() {
    setVerificationErrorMSG(false);
    await fetch("/api/account/verify", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resend: true,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (data.status == RESPONSE_TYPE.SUCCESS) {
        setVerificationEmailSent(true);
      }
    });
  }

  useEffect(() => {
    let timer;
    if (verificationEmailSent) {
      timer = setTimeout(() => setVerificationEmailSent(false), 5000);
    }

    // Cleanup function
    return () => clearTimeout(timer);
  }, [verificationEmailSent]);

  useEffect(() => {
    let timer;
    if (verificationErrorMSG) {
      timer = setTimeout(() => setVerificationErrorMSG(false), 5000);
    }

    // Cleanup function
    return () => clearTimeout(timer);
  }, [verificationErrorMSG]);


  const EmailSent = () => {
    return (
        <div className="toast toast-center rounded-sm pb-20">
          <div className="alert alert-success">
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
            <span>Verification Email Sent</span>
            <span></span>
          </div>
        </div>
      );
  }


  const VerificationError = () => {
    return (
      <div className="toast toast-center rounded-sm pb-20">
        <div className="alert alert-error">
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
          <span>Verification Error: {verificationResponse}</span>
          <span></span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="m-4 min-h-[50vh] w-full max-w-sm lg:max-w-4xl">
          <div className="flex items-center justify-center gap-2 p-8">
            <h1 className="text-lg font-bold">New Account</h1>
          </div>

          <main className="grid bg-base-100 lg:aspect-[2/1] lg:grid-cols-2 h-full">
            <figure className="pointer-events-none bg-base-300 object-cover max-lg:hidden">
              <img src="/rectangle-logo.png" alt="Login" />
            </figure>
            <form
              id="verificationForm"
              onSubmit={verify}
              className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
            >
              <div className="form-control">
                <label className="label" htmlFor="input1">
                  <span className="label-text">Verification Code</span>
                </label>
                <input
                  type=""
                  placeholder=""
                  className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                  pattern="^\d{6}$"
                  minLength="6"
                  required
                  id="verificationCode"
                />
              </div>

              {isLoading ? (
                <button
                  className="btn btn-neutral buttonLoader"
                  type="submit"
                  id="submit"
                >
                  <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                  </svg>
                </button>
              ) : (
                <button className="btn btn-neutral" type="submit" id="submit">
                  Verify
                </button>
              )}

              <div className="label justify-end">
                <div onClick={resendVerify} className="link-hover link label-text-alt">
                  Resend Verification Code
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
      {verificationErrorMSG ? <VerificationError /> : <></>}
      {verificationEmailSent ? <EmailSent /> : <></>}
    </>
  );
}
