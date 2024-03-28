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
            setRetrievingError(true);
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
      <div className="flex flex-col space-y-2 bg-gray-200">
        {/* Add a header row here for column titles */}
        <div className="grid grid-cols-3 text-sm font-semibold p-3 bg-gray-200 rounded-t-md">
          <div className="text-left">Document ID</div>
          <div className="text-center">Type</div>
          <div className="text-right">Date</div>
        </div>
        {Object.entries(mappedDocuments)
          .filter(
            ([id, document]) => !document.type.toLowerCase().includes("json")
          )
          .map(([id, document]) => (
            <a
              href={`/api/account/document?id=${id}`}
              key={id}
              className="grid grid-cols-3 items-center p-3 py-2 rounded-md hover:bg-gray-300"
            >
              <div className="text-left font-medium">{document.id}</div>
              <div className="text-center font-medium">
                {formatDocumentType(document.type)}
              </div>
              <div className="text-right font-medium">{document.date}</div>
            </a>
          ))}
      </div>
    </div>
  );
}
