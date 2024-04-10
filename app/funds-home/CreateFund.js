"use client";
import { useState } from "react";

export default function CreateFund() {
    const [alert, setAlert] = useState(null);
    const [isLoading, setLoading] = useState(false);

    async function createFund(event) {
        event.preventDefault();
        setLoading(true);
        setAlert(["Creating fund...", "success"]);

        const period = document.getElementById("disbursementPeriod");
        const type = document.getElementById("disbursementType");

        await fetch("/api/fund/create", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                symbol: document.getElementById("symbol").value,
                description: document.getElementById("description").value,
                disbursementPeriod: period.options[period.selectedIndex].text.toLowerCase(),
                disbursementType: type.options[type.selectedIndex].text,
                public: document.getElementById("public").checked
            }),
        })
        .then(async (response) => {
            const data = await response.json();
      
            if (data.status == "success") {
                setAlert(["Fund created!", "success"])
                window.location.reload();
            } else {
                setAlert([data.message, "error"]);
            }

            setLoading(false);

            setTimeout(() => setAlert(null), 5000);
        })
    }

    return (
        <>
        <div className="flex items-center justify-center gap-2 p-8">
            <h1 className="text-lg font-bold">Create a fund</h1>
          </div>

          <main className="h-full">
            <form
              id="fundForm"
              onSubmit={createFund}
              className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
            >
                    <div className="form-control m-2">
                        <label className="label" htmlFor="name">
                            <span className="label-text">Fund Name</span>
                        </label>
                        <input
                        type="text"
                        placeholder="Name"
                        className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                        required
                        id="name"
                        />
                    </div>

                    <div className="form-control m-2">
                        <label className="label" htmlFor="symbol">
                            <span className="label-text">Fund Symbol</span>
                        </label>
                        <input
                        type="text"
                        placeholder="Symbol"
                        className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                        required
                        id="symbol"
                        />
                    </div>

                    <div className="form-control m-2">
                        <label className="label" htmlFor="description">
                            <span className="label-text">Fund Description</span>
                        </label>
                        <textarea
                        type="text"
                        placeholder="Describe your fund investment strategy"
                        className="textarea textarea-bordered"
                        required
                        id="description"
                        />
                    </div>

                    <select required id="disbursementPeriod" className="select w-full max-w-xs m-2">
                        <option disabled selected>Disbursement Period</option>
                        <option>Quarterly</option>
                        <option>Monthly</option>
                        <option>Hourly</option>
                        <option>Daily</option>
                    </select>

                    <select required id="disbursementType" className="select w-full max-w-xs m-2">
                        <option disabled selected>Disbursement Type</option>
                        <option>1/10</option>
                        <option>2/20</option>
                        <option>3/30</option>
                    </select>

                <div className="flex items-center justify-between gap-3 m-2">
                    <label className="flex cursor-pointer gap-3">
                    <input
                        name="public"
                        type="checkbox"
                        className="toggle"
                        id="public"
                        defaultChecked="true"
                    />
                    Public
                    </label>
                </div>
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
                  Create Fund
                </button>
              )}
            </form>
        </main>

        {alert?.[1] == 'error' ? (
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
            <span>{alert?.[0]}</span>
          </div>
        </div>
      ) : (
        <></>
      )}

      {alert?.[1] == 'success' ? (
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert?.[0]}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
        </>
    );
}