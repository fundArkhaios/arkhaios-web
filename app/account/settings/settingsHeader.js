'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function SettingsHeader() {

    const pathname = usePathname();

    const headerLink = (path, text) => {
        const isActive = pathname === path;
        var fontClass = "font-extrabold"; // Boldneess
        const textClass = isActive ? "text-amber-100" : "text-white hover:text-amber-100"; // Color
        

        return (
          <Link href={path} className={`py-2 ${fontClass} ${textClass}`}>
            {text}
          </Link>
        );
      };



    return (
        <div className = "flex flex-col pl-20 px-2 border-r-2 pt-10">
            {headerLink("/account/settings/personal-information", "Personal Information")}
            {headerLink("/account/settings/security-privacy", "Security & Privacy")}
            {headerLink("/account/settings/beneficiaries", "Beneficiaries")}
        </div>
    )

}