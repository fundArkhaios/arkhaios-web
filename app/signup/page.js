"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { RESPONSE_TYPE } from "../../api/response_type";

export default function Page( {renderScreen} ) {
  const [isLoading, setIsLoading] = useState();
  const [registerError, setRegisterError] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  async function register(event) {
    setIsLoading(true);
    event.preventDefault();
    const response = await fetch("/api/account/register", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (data.status != RESPONSE_TYPE.SUCCESS) {
        setRegisterError(true);
        if (data.message == "email is already in use") {
          setResponseMessage("Email is already in use!");
        }
      } else if (data.status == RESPONSE_TYPE.SUCCESS){
        //setRenderVerification(true);
        window.location.href = "/signup/verify"
      }
      setIsLoading(false);
    });
  }
  // const [renderVerification, setRenderVerification] = useState(false);

  
  const [samePassword, setSamePassword] = useState("");

  function verifyPassword() {
    setSamePassword(document.getElementById("password").value);
  }

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
                id="signupForm"
                onSubmit={register}
                className="flex flex-col justify-center gap-3 px-10 py-6 lg:px-16"
              >
                <div className="flex flex-row">
                  <div className="justify-start">
                    <label className="label" htmlFor="input1">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="john"
                      className="input input-bordered max-w-20 [&:user-invalid]:input-warning [&:user-valid]:input-success inputNames"
                      pattern="^[a-zA-Z0-9_.-]*$"
                      minLength="1"
                      required
                      id="firstName"
                    />
                  </div>
                  <div className="px-10 justify-end">
                    <label className="label" htmlFor="input1">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="doe"
                      className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success inputNames"
                      pattern="^[a-zA-Z0-9_.-]*$"
                      minLength="1"
                      required
                      id="lastName"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="input1">
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

                <div className="form-control">
                  <label className="label" htmlFor="input2">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    pattern={samePassword}
                    type="password"
                    id="password"
                    placeholder="password"
                    className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                    required
                    minLength="6"
                    onChange={verifyPassword}
                  />
                </div>

                <div className="form-control">
                  <input
                    type="password"
                    id="passwordConfirm"
                    pattern={samePassword}
                    placeholder="confirm password"
                    className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                    required
                    minLength="6"
                    onChange={verifyPassword}
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
                    Register
                  </button>
                )}

                <div className="label justify-end">
                  <Link
                    className="link-hover link label-text-alt"
                    href="/login"
                  >
                    Login to existing accout
                  </Link>
                </div>
              </form>
          </main>
        </div>
      </div>
      {registerError ? (
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
            <span>Sign up Erorr. {responseMessage}</span>
            <span></span>
          </div>
        </div>
      ) : (
        <></>
      )}
      
    </>
  );
}
