"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
export default function Page() {
  const [mfaRequired, setMfaRequired] = useState(false);
  const [emailState, setEmail] = useState("");
  const [passwordState, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState();
  const [loginErorr, setLoginError] = useState();

  async function login(event) {
    setIsLoading(true);
    event.preventDefault();

    const mfa = document.getElementById("mfa")?.value;
    const email = mfa ? emailState : document.getElementById("email").value;
    const password = mfa
      ? passwordState
      : document.getElementById("password").value;

    let payload = { email: email, password: password };
    if (mfa) payload.mfa = mfa;

    await fetch("/api/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.status == "success") {
          // router.push('/');

          window.location.href = "/home";
          setLoginError(false);
        } else {
          if (data?.data["mfa"] == true) {
            setEmail(email);
            setPassword(password);
            setMfaRequired(true);
            setLoginError(false);
          }
          setLoginError(true); 
          // throw new Error("Invalid username or password.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setLoginError(true);
        setIsLoading(false)
        console.log(error);
        throw new Error("A server error has occurred.");
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }

  const form = mfaRequired ? (
    <>
      <div className="form-control">
        <label className="label" htmlFor="input1">
          <span className="label-text">Authenticator Code</span>
        </label>
        <input
          type="text"
          placeholder="code"
          className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
          required
          id="mfa"
        />
      </div>
    </>
  ) : (
    <>
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
          type="password"
          id="password"
          placeholder="password"
          className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
          required
          minLength="6"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer gap-3 text-xs">
          <input
            name="remember-me"
            type="checkbox"
            className="toggle toggle-xs"
          />
          Remember me
        </label>
        <Link href="/recovery" className="link-hover link label-text-alt">
          Forgot password?
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
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
          <h1 className="text-lg font-bold">Login</h1>
        </div>

        <main className="grid bg-base-100 lg:aspect-[2/1] lg:grid-cols-2 h-full">
          <figure className="pointer-events-none bg-base-300 object-cover max-lg:hidden">
            <Image
              width={500}
              height={500}
              src="/rectangle-logo.png"
              alt="Login"
            />
          </figure>

          <form
            id="loginForm"
            onSubmit={login}
            className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
          >
            {loginErorr ? (
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
                <span>Login Error!</span>
              </div>
            ) : (
              <></>
            )}
            {form}
            {isLoading ? (
              <button
                className="btn btn-neutral buttonLoader cursor-progress"
                type="submit"
                id="submit"
              >
                <svg viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              </button>
            ) : (
              <button className="btn btn-neutral" type="submit" id="submit">
                Login
              </button>
            )}

            <div className="label justify-end">
              <Link href="/signup" className="link-hover link label-text-alt">
                Create new account
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
