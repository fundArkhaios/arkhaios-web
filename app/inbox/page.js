"use client"
import { useEffect, useState } from "react";

export default function Page() {
    const [eventList, setEventList] = useState([]);

    async function readNotification(id) {
        let index = -1;
        let object = {};
        let unread = 0;
        for (let i = 0; i < eventList.length; ++i) {
            if (eventList[i].id == id) {
                index = i;

                object = eventList[i];
                object.read = true;
            } else if (!eventList[i].read) unread++;
        }

        if (index >= 0) {
            setEventList((eventList) => [
                ...eventList.slice(0, index),
                object,
                ...eventList.slice(index + 1)
            ]);

            await fetch("/api/account/read-notification", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id })
            });
        }
    }

    useEffect(() => {
        let isMounted = true; // flag to check if component is still mounted
      
        const fetchData = async () => {
          const response = await fetch("/api/account/notifications", {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            }
          });
      
          if (response.ok && isMounted) {
            const json = await response.json();
            setEventList(json.data);
          }
        };
      
        fetchData();
      
        // Cleanup function to set isMounted to false when component unmounts
        return () => {
          isMounted = false;
        };
      }, []);

    return (
        <main className = "py-6 px-10">
            <p className = "text-center text-5xl font-bold text-white place-self-center py-2 drop-shadow-lg">Inbox</p>
            <div className = "flex flex-col px-10 pt-5 justify-center text-lg pb-4 border-t border-amber-200">
                {eventList.map(event => {
                    return (
                    <button className="btn flex mb-2 flex-row items-center w-full" onClick={() => readNotification(event.id)}>
                        <div className={`${event.read ? "" : "bg-rose-500"} rounded-full w-3 h-3 p-0 left-px mr-1`}></div>
                        <span>
                        <p className="text-lg">{event.message}</p>
                        <p className="text-thin text-xs text-slate-300">{new Date(event.time).toLocaleString()}</p>
                        </span>
                    </button>);
                })}
            </div>
        </main>
    )
}