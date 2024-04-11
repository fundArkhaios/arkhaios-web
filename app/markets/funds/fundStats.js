"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function FundStats({
  fund,
  desc,
  announcements,
  disbursementTip,
}) {
  const [descPage, setDescPage] = useState("Summary");
  const [body, setBody] = useState();

  useEffect(() => {
    if (descPage == "Summary") {
      setBody(<SummaryComponent />);
    } else if (descPage == "Announcements") {
      setBody(<AnnouncementComponent />);
    } else if (descPage == "Statistics") {
      setBody(<p className="font-light text-white text-lg">Stats</p>);
    }
  }, [descPage]);

  const SummaryComponent = () => {
    return (
      <div>
        <div className = "py-2">
        <div className="flex flex-col place-content-start content-end">
          <p className="font-thin text-xs ">Description</p>{" "}
          <p classsName="font-light text-white text-lg">{desc}</p>
        </div>
        </div>
        <div className="grid grid-cols-2 pt-12">
          <div className="">
            <p className="text-white text-2xl">Terms & Conditions</p>
            <div className="flex">
              <p className="text-white text-lg mr-1">Term:</p>
              <p className="text-slate-200 text-lg">
                {fund.fundDisbursementPeriod.slice(0, 1).toUpperCase()}
                {fund.fundDisbursementPeriod.slice(1)}
              </p>
            </div>

            <div className="flex items-center">
              <p className="text-white text-lg mr-1">Distribution Fee:</p>
              <p className="text-slate-200 text-lg">{fund.disbursementType}</p>
              <div className="tooltip" data-tip={disbursementTip}>
                <InformationCircleIcon className="mx-2 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnnouncementComponent = () => {
    return (
      <p className="p-2 font-light text-black text-lg ml-2 ">
        {announcements?.map((announcement) => (
          <div key={announcement.body} className = "p-2">
            <div className="text-black p-2 bg-slate-100 rounded-md">
              <p className="font-light text-2xl">{announcement.title}</p>
              <p className="text-black font-thin text-sm">
                {new Date(announcement.time * 1000).toLocaleString()}
              </p>
              <p className="mb-2">{announcement.body}</p>
            </div>
          </div>
        ))}
      </p>
    );
  };

  const HeaderComponent = ({ Title }) => {
    return (
      <p
        onClick={() => setDescPage(Title)}
        className={`${
          descPage == 0 ? "text-white" : "text-gray"
        } text-2xl mr-2 cursor-pointer hover:text-white`}
      >
        {Title}
      </p>
    );
  };

  return (
    <div className = "w-full">
      <div className="border-b border-amber-200 p-2">
        <div className="flex flex-row justify-between gap-x-10 ">
          <HeaderComponent Title={"Summary"} />
          <HeaderComponent Title={"Announcements"} />
          <HeaderComponent Title={"Statistics"} />
        </div>
      </div>
      <div className="border-t border-amber-200">
        <div>{body}</div>
      </div>
    </div>
  );
}
