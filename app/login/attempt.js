"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [mfaRequired, setMfaRequired] = useState(false);
  const [emailState, setEmail] = useState("");
  const [passwordState, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState("");

  async function login(event) {
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
          setIsLoading(true);
          window.location.href = "/home";
        } else {
          if (data?.data["mfa"] == true) {
            setEmail(email);
            setPassword(password);
            setMfaRequired(true);
          }

          throw new Error("Invalid username or password.");
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("A server error has occurred.");
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
    <main className="loginFlow min-h-screen grid bg-base-100 lg:aspect-[2/1] lg:grid-cols-2">
      <div className="justify-self-center"></div>
      <div className="p-10 min-h-screen bg-zinc-900  opacity-90">
        <div className="text-center interFont text-white py-10">Login</div>
        <div className = "flex flex-col-2">
          <div class="input-group interFont px-10">
            <input
              required=""
              type="text"
              name="text"
              autocomplete="off"
              className="inputer"
            ></input>
            <label className="user-label">First Name</label>
          </div>

          <div class="input-group">
            <input
              required=""
              type="text"
              name="text"
              autocomplete="off"
              className="inputer"
            ></input>
            <label className="user-label">Last Name</label>
          </div>
        </div>
      </div>
    </main>
  );
}
