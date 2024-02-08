"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./components/search";
import "./globals.css";
import "./../output.css";

export default function Header({ user }) {
  const pathname = usePathname();

  // let [theme, setTheme] = useState("dark");

  /**
   *
   * @param {*} str Name
   * @returns Returns a string whose first letter is uppercase and the rest lower-case.
   */
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function haveSameInitialDomainPath(path1, path2) {
    // Split the paths by '/' to get the individual components
    const components1 = path1.split("/").filter(Boolean); // filter(Boolean) removes any empty strings due to leading '/'
    const components2 = path2.split("/").filter(Boolean);

    // Check if there is at least one component to compare
    if (components1.length === 0 || components2.length === 0) {
      return false; // One of the paths is the root path, so they do not match
    }

    // Compare the first component of both paths
    return components1[0] === components2[0];
  }

  const headerLink = (path, text) => {
    
    
    const isActive = haveSameInitialDomainPath(path, pathname);

    var fontClass = "text-sm font-extrabold interFont"; // Boldneess
    const textClass = isActive
      ? "text-yellow-200"
      : "text-white hover:text-yellow-200"; // Color

    if (text == "ARKHAIOS") {
      fontClass = "font-black text-lg josefinFont";
    }

    return (
      <Link
        href={path}
        className={`w-20 h-9 ${fontClass} ${textClass} no-underline px-5`}
      >
        {text}
      </Link>
    );
  };

  /*
  
  */
  return (
    <div className="flex justify-items-center bg-color-black">
      {/*  Left Side  */}
      <div className="m-2 flex grow items-center px-10">
        <div>{headerLink("/home", "ARKHAIOS")}</div>

        {/*<img src="/noBackgroundArkhaiosLogo.png" width={50} height={70}/>*/}
      </div>

      {/*  Center  */}
      <div className="m-2 flex grow items-center pr-5">
        <Search />
      </div>
      {/*  Right Side  */}

      <div className="flex px-10 pr-10">
        <div className="flex px-10 justify-items-center items-center mt-5 mb-6 dark:text-slate-300">
          <label className="px-10 text-xs">
            {headerLink("/friends", "FRIENDS")}
          </label>

          <button className="flex justify-center">
            <label>{headerLink("/inbox", "INBOX")}</label>
            <div className="badge">+99</div>
          </button>
        </div>
      </div>

      {/*  Right Side  */}

      <div className="flex items-center pr-10">
        <div className="pl-2 text-center">
          {headerLink(
            "/account/profile",
            user.firstName.toUpperCase() + " " + user.lastName.toUpperCase()
          )}
        </div>
      </div>
    </div>
  );
}
