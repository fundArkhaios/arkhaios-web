"use client";
import { useState } from "react";
import FundChart from '../markets/funds/fundChart'
import ManageMembers from "./ManageMembers";

export default function ManageFund({fund}) {
    const [alert, setAlert] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isAnnouncementLoading, setAnnouncementLoading] = useState(false);

    async function makeAnnouncement(event) {
      event.preventDefault();
      setAnnouncementLoading(true);
      setAlert(["Making announcement...", "success"]);

      await fetch("/api/fund/announcement", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              id: fund.fundID,
              title: document.getElementById("announcement-subject").value,
              body: document.getElementById("announcement-body").value,
          }),
      })
      .then(async (response) => {
          const data = await response.json();
    
          if (data.status == "success") {
              setAlert(["Announcement posted!", "success"])
              window.location.reload();
          } else {
              setAlert([data.message, "error"]);
          }

          setLoading(false);

          setTimeout(() => setAlert(null), 5000);
      })
  }
    
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
                description: document.getElementById("description").content,
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
        <div className="pl-12 grid grid-cols-2 pt-12">
          <div className="justify-self-center max-w-5xl pl-10">
            <div className = "text-5xl font-light text-white">{fund.fundName}</div>
            <div className = "text-3xl font-light text-slate-200">{fund.fundSymbol}</div>
            <FundChart symbol={fund.fundSymbol} />

          </div>

          <ManageMembers fundID={fund.fundID}/>
        </div>

        <div className="flex items-center justify-center gap-2 p-8">
            <h1 className="text-lg font-bold">Create a fund</h1>
          </div>



          <div className="flex items-center justify-center gap-2 p-8">
            <h1 className="text-lg font-bold">Create a fund</h1>
          </div>

          <main className="h-full">
            <form
              id="announcementForm"
              onSubmit={makeAnnouncement}
              className="flex flex-col justify-center gap-4 px-10 py-10 lg:px-16"
            >
                    <div className="form-control m-2">
                        <label className="label" htmlFor="name">
                            <span className="label-text">Announcement Subject</span>
                        </label>
                        <input
                        type="text"
                        placeholder="Name"
                        className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                        required
                        id="announcement-subject"
                        />
                    </div>

                    <div className="form-control m-2">
                        <label className="label" htmlFor="description">
                            <span className="label-text">Announcement Text</span>
                        </label>
                        <textarea
                        type="text"
                        placeholder="Make an announcement"
                        className="textarea textarea-bordered"
                        required
                        id="announcement-body"
                        />
                    </div>
              {isAnnouncementLoading ? (
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
                  Make announcement
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