'use client'

import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  AdjustmentsVerticalIcon
} from "@heroicons/react/24/solid";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function SideBar() {

  const { user } = useContext(UserContext);
  
  return (
    <div className="bg-black pt-16 fixed h-screen h-dvh flex overflow-hidden">
      {/* Sidebar */}
      <aside className="sticky top-0 flex flex-col overflow-y-auto gap-2 py-6 px-2 bg-base-200">
        <a
          className="btn btn-square btn-ghost text-xl"
          title="Home"
          href="https://arkhaios.io"
        >
          <HomeIcon className="h-6 w-6" />
        </a>

        <a
          className="btn btn-square btn-ghost text-xl"
          title="Funds"
          href="/dashboard"
        >
          <UserGroupIcon className="h-6 w-6" />
        </a>

        {user.fundsManaging ? (
          <a className="btn btn-square btn-ghost text-xl" title="Finances" href="/fundFinances">
            <BanknotesIcon className="h-6 w-6" />
          </a>
        ) : (
          <></>
        )}
        {user.fundsManaging ? (
          <a className="btn btn-square btn-ghost text-xl" title="Fund Settings">
            <AdjustmentsVerticalIcon className="h-6 w-6" />
          </a>
        ) : (
          <></>
        )}
      </aside>
    </div>
  );
}
