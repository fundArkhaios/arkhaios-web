"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./components/search";
import "./globals.css";
import "./../output.css";
import SideBar from "./sidebar";

export default function Header({ user }) {
  const pathname = usePathname();

  // let [theme, setTheme] = useState("dark");

  async function logout() {
    await fetch("/api/account/logout", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        if (response.status === 200) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

  const dropDownLink = (path, text) => {
    const isActive = pathname === path;

    var fontClass = "text-sm font-bold interFont text-nowrap"; // Boldneess
    const textClass = isActive
      ? "text-yellow-200"
      : "text-white hover:text-yellow-200"; // Color

    return (
      <Link href={path} className={`${fontClass} ${textClass} no-underline`}>
        {text}
      </Link>
    );
  };

  const dropDownHeader = (path, text) => {
    const isActive = haveSameInitialDomainPath(path, pathname);

    var fontClass = "text-sm font-bold interFont text-nowrap"; // Boldneess
    const textClass = isActive
      ? "text-yellow-200"
      : "text-white hover:text-yellow-200"; // Color

    return (
      <Link href={path} className={`${fontClass} ${textClass} no-underline`}>
        {text}
      </Link>
    );
  };

  const headerLink = (path, text) => {
    const isActive = haveSameInitialDomainPath(path, pathname);

    var fontClass = "text-sm font-extrabold interFont"; // Boldneess
    const textClass = isActive
      ? "text-yellow-200"
      : "text-[#7c7c6f] hover:text-yellow-100 hover:shadow-lg shadow-yellow-100"; // Color

    if (text == "ARKHAIOS") {
      fontClass = "font-black text-lg josefinFont";
    }

    return (
      <Link
        href={path}
        className={`w-20 h-9 ${textClass} ${fontClass} no-underline px-5`}
      >
        {text}
      </Link>
    );
  };

  /*
  
  */
  return (
    <>
    
    <div className="flex justify-items-center bg-color-black">
      {/*  Left Side  */}
      <div className="m-2 flex grow items-center px-10">
        <div className = "josefinFont">{headerLink("/home", "ARKHAIOS")}</div>

        {/*<img src="/noBackgroundArkhaiosLogo.png" width={50} height={70}/>*/}
      </div>

      {/*  Center  */}
      <div className="m-2 flex grow items-center pr-5">
        <Search />
      </div>
      {/*  Right Side  */}

      <div className="flex px-10 pr-10">
        <div className="flex px-5 justify-items-center items-center mt-5 mb-6 dark:text-slate-300">
        <label className="px-2 text-xs">
            {headerLink("/markets", "MARKETS")}
          </label>
          <label className="px-2 text-xs">
            {headerLink("/friends", "FRIENDS")}
          </label>

          <button className="flex justify-center">
            <label className = "px-2">{headerLink("/inbox", "INBOX")}</label>
          </button>
        </div>
      </div>

      {/*  Right Side  */}

      <div className="flex items-center pr-10">
        <div className="pl-2 text-center">
          <div className="dropdown dropdown-end dropdown-hover text-md">
            <div tabIndex={0} role="button">
              {headerLink("/account/profile", "ACCOUNT")}
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <div className="flex" title="View profile">
                  <img
                    alt=""
                    src="/avatar.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div className="flex flex-col">
                    <h3 className="font-bold">
                      {dropDownHeader(
                        "/account/profile",
                        user.firstName.toUpperCase() +
                          " " +
                          user.lastName.toUpperCase()
                      )}
                    </h3>
                    <span className="text-xs text-accent">{user.email}</span>
                  </div>
                </div>
              </li>
              <div className="divider my-0"></div>
              <li>{dropDownLink("/account/investing", "Investing")}</li>
              <li>{dropDownLink("/account/transfers", "Transfers")}</li>
              <li>
                {dropDownLink(
                  "/account/reports-statements",
                  "Reports & Statements"
                )}
              </li>
              <div className="divider my-0"></div>
              <li>{dropDownLink("/account/settings/personal-information", "Settings")}</li>
              <li>{dropDownLink("/account/help", "Help")}</li>
              <div className="divider my-0"></div>
              <li>
                <button
                  onClick={logout}
                  className="place-content-center font-bold"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
