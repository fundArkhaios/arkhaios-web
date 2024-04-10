"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";

export default function FundStats ({ desc, announcements }) {
    const [descPage, setDescPage] = useState(0)
    const [body, setBody] = useState();

    useEffect(() => {
        if(descPage == 0) {
            setBody(<p className="font-light text-white text-lg">{desc}</p>);
        } else if(descPage == 1) {
            let data = <>{announcements?.map((announcement) => {
                return (<span className="p-2">
                <p className="font-light text-2xl">{announcement.title}</p>
                <p className="text-slate-300 font-thin">{(new Date(announcement.time * 1000).toLocaleString())}</p>
                <p className="mb-2">{announcement.body}</p>
                </span>);
            })}
            </>;

            setBody(<p className="font-light text-white text-lg ml-2">{data}</p>);
        } else if(descPage == 2) {
            setBody(<p className="font-light text-white text-lg">Stats</p>);
        }
    }, [descPage]);

    return (
        <>
        <div className="flex">
            <p onClick={()=>setDescPage(0)} className={`${descPage == 0 ? "text-white" : "text-gray"} text-2xl mr-2 cursor-pointer`}>Summary</p>
            <p onClick={()=>setDescPage(1)} className={`${descPage == 1 ? "text-white" : "text-gray"} text-2xl mr-2 cursor-pointer`}>Announcements</p>
            <p onClick={()=>setDescPage(2)} className={`${descPage == 2 ? "text-white" : "text-gray"} text-2xl mr-2 cursor-pointer`}>Stats</p>
        </div>

        <div>
            <div>
                {body}
            </div>
        </div>
        </>
    );
}