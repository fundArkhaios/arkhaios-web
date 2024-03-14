import { HomeIcon, UserGroupIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

export default function SideBar() {
  return (
    <div className="flex overflow-hidden relative">
      {/* Sidebar */}
      <aside className="h-screen sticky top-0 flex flex-col overflow-y-auto gap-2 py-6 px-2 bg-base-200">
        
        <a className="btn btn-square btn-ghost text-xl" title="Data">
          <UserGroupIcon className="h-6 w-6" />
        </a>


        <a className="btn btn-square btn-ghost text-xl" title="Calendar">
          <CalendarDaysIcon className="h-6 w-6"/>
        </a>
      </aside>
    </div>
  );
}
