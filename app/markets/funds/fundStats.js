"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";

export default function FundStats({ desc, announcements }) {
  const [descPage, setDescPage] = useState("Summary");
  const [body, setBody] = useState();

  useEffect(() => {
    if (descPage == "Summary") {
      setBody(<p className="font-light text-white text-lg">{desc}</p>);
    } else if (descPage == "Announcements") {
      setBody(<AnnouncementComponent />);
    } else if (descPage == "Statistics") {
      setBody(<p className="font-light text-white text-lg">Stats</p>);
    }
  }, [descPage]);

  const SummaryComponent = () => {
    return <></>;
  };

  const AnnouncementComponent = () => {
    return (
      <p className="p-2 font-light text-black text-lg ml-2 ">
        {announcements?.map((announcement) => (
          <div key={announcement.body}>
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
    <>
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
    </>
  );
}
