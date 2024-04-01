'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link'
export default function AccountHeader() {
    const pathname = usePathname();

    const headerLink = (path, text) => {
        const isActive = pathname === path;
        var fontClass = ""; // Boldneess
        const textClass = isActive ? "text-amber-200" : "text-white hover:text-amber-200"; // Color
        

        return (
          <Link href={path} className={`${fontClass} ${textClass}`}>
            {text}
          </Link>
        );
      };


    return (
    <div className = "flex col-1 px-10 pt-5 justify-center space-x-16 text-lg pb-4 border-b border-amber-200">
        {headerLink("/account/profile", "Profile")}
        {headerLink("/account/investing", "Investing")}
        {headerLink("/account/transfers", "Transfers")}
        {headerLink("/account/reports-statements", "Reports & Statements")}
        {headerLink("/account/settings/personal-information", "Settings")}
        {headerLink("/account/help", "Help")}
    </div>
    );


}