"use client";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function BottomLeft({ fundID }) {
    
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [responseError, setResponseError] = useState(false);

  const [fundMemberRequests, setFundMemberRequests] = useState([]);

  // Function to fetch the latest fund member requests
  const fetchFundMemberRequests = async () => {
    const response = await fetch("/api/fund/members?id=" + fundID);
    const data = await response.json();
    if (data && data.data) {
      setFundMemberRequests(data.data.requests);
    }
  };

  // Initial fetch for fund member requests
  useEffect(() => {
    fetchFundMemberRequests();
  }, []);

  useEffect(() => {
    if (responseSuccess || responseError) {
      const timer = setTimeout(() => {
        setResponseSuccess('');
        setResponseError('');
      }, 3000); // 3 seconds for the toast message
      return () => clearTimeout(timer);
    }
  }, [responseSuccess, responseError]);

  const ResponseErrorToast = () => {
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
          <span>{responseError}</span>
          <span></span>
        </div>
      </div>
    );
  };

  const ResponseSuccessToast = ({ action }) => {
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{action}</span>
          <span></span>
        </div>
      </div>
    );
  };

  async function responseRequest(requesterID, action) {
    const response = await fetch("/api/fund/join", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fundID: fundID,
        type: "response",
        action: action,  
        requester: requesterID,
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      // Call the fetch function to refresh the list
      await fetchFundMemberRequests();
      setResponseSuccess(`Member ${action}ed successfully.`);
    } else {
      setResponseError('An error occurred'); // Set the response error message
    }
  }

  return (
    <>
      <div className=" border-2 rounded-md">
        <p className="text-center text-lg  rounded-tl-sm rounded-tr-sm border-b bg-gray-200 text-black">
          {" "}
          Requests to join
        </p>

        <div className="h-56 border-b border-l border-r rounded-bl-md rounded-br-md">
          {fundMemberRequests?.map((member) => (
            <>
              <div key={member.id} className="grid grid-cols-2 py-2">
                <div className="justify-self-start px-5">{member.name}</div>
                <div className="flex flex-row gap-x-4 justify-self-end px-2">
                  <button
                    onClick={() => {
                      responseRequest(member.id, "accept");
                    }}
                    className="hover:underline "
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      responseRequest(member.id, "reject");
                    }}
                    className="hover:underline"
                  >
                    Deny
                  </button>

                  <div className="tooltip tooltip-info" data-tip={member.inquiry}>
                    <InformationCircleIcon className="mx-2 h-5 w-5"/>
                    </div>
                </div>
              </div>
              <p className=" px-2 w-full divider my-0"></p>
            </>
          ))}
        </div>
      </div>
      {responseSuccess && <ResponseSuccessToast action={responseSuccess} />}
      {responseError ? <ResponseErrorToast /> : <></>}
    </>
  );
}
