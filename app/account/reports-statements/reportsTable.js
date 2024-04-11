"use client";
import { useEffect, useState } from "react";

import { RESPONSE_TYPE } from "../../../api/response_type";

export default function ReportsTable() {
  const [retrievingError, setRetrievingError] = useState(false);
  const [mappedDocuments, setMappedDocuments] = useState({});

  useEffect(() => {
    async function getDocuments() {
      const sessionData = sessionStorage.getItem("documents");
      if (sessionData) {
        // If we have session data, parse it and set it to state
        setMappedDocuments(JSON.parse(sessionData));
      } else {
        // If not, fetch the data and then set it to the session
        const response = await fetch("/api/account/get-documents", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            const initialDocs = {};
            if (response.status == RESPONSE_TYPE.SUCCESS) {
              console.log("yo");
              response.data.forEach((document) => {
                initialDocs[document.id] = document;
              });
              sessionStorage.setItem("documents", JSON.stringify(initialDocs)); // Save to session storage
              console.log("docs: " + response.data);
              setMappedDocuments(initialDocs);
            } else if (response.status === RESPONSE_TYPE.FAILED) {
              setRetrievingError(true);
            } else {
              // System Error
            }
          })
          .catch((error) => {
            // Handle any errors here
            // setRetrievingError(true);
          });
      }
    }
    getDocuments();
  }, []);

  const formatDocumentType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <div className="text-center font-bold text-lg mb-4 pt-2">
        Arkhaios & Alpaca - Reports, Agreements, and Disclosures
      </div>
      {retrievingError && (
        <div className="text-center text-red-500">
          There was an error retrieving the documents.
        </div>
      )}
      {/* Adding the table with daisyUI classes */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamic rows from mappedDocuments */}
            {Object.entries(mappedDocuments)
              .filter(
                ([id, document]) =>
                  !document.type.toLowerCase().includes("json")
              )
              .map(([id, document]) => (
                <tr
                  key={id}
                  className="hover"
                  onClick={() =>
                    (window.location.href = `/api/account/document?id=${id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <th>{document.id}</th>
                  <td>{formatDocumentType(document.type)}</td>
                  <td>{document.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
