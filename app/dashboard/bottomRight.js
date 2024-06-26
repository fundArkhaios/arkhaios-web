"use client";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function BottomRight({ fundID }) {
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
              id: fundID,
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


    

    return (
        <>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg font-bold">Make an announcement</h1>
          </div>

          <main className="h-full">
            <form
              id="announcementForm"
              onSubmit={makeAnnouncement}
              className="flex flex-col justify-center gap-2 px-10 py-5 lg:px-16"
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