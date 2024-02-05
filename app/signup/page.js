"use client";

import Link from "next/link";

import React, { useState } from "react";

export default function Page() {

  const [isLoading, setIsLoading] = useState();

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
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error || response.status != "Success") {
          // setRegisterError(response.status);
        } else {
          window.location.href = "/home";
        }
        setIsLoading(false);
      });
  }

  const [samePassword, setSamePassword] = useState("");

  function verifyPassword() {
    setSamePassword(document.getElementById("password").value);
  }

  return (
    <body className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="m-4 min-h-[50vh] w-full max-w-sm lg:max-w-4xl">
        <div className="flex items-center justify-center gap-2 p-8">
          <svg
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="256"
              y="670.72"
              width="512"
              height="256"
              rx="128"
              className="fill-base-content"
            />
            <circle
              cx="512"
              cy="353.28"
              r="256"
              className="fill-base-content"
            />
            <circle
              cx="512"
              cy="353.28"
              r="261"
              stroke="black"
              strokeOpacity="0.2"
              strokeWidth="10"
            />
            <circle
              cx="512"
              cy="353.28"
              r="114.688"
              className="fill-base-200"
            />
          </svg>
          <h1 className="text-lg font-bold">New Account</h1>
        </div>

        <main classNtame="shadow-xl grid bg-base-100 lg:aspect-[2/1] lg:grid-cols-2 h-full w-full">
          <figure className="pointer-events-none bg-base-300 object-cover max-lg:hidden">
            <img src="rectangle-logo.png" alt="Login" />
          </figure>

          <form
            id="signupForm"
            onSubmit={register}
            className="flex flex-col justify-center gap-4 px-10 py-6 lg:px-16"
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
              {/* <label className="label" htmlFor="input2"><span className="label-text">Password</span></label> */}
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
              <Link className="link-hover link label-text-alt" href="/login">
                Login to existing accout
              </Link>
            </div>
          </form>
        </main>
      </div>
    </body>
  );
}
