'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import Search from './components/search';
import "./globals.css";
import './../output.css';

export default function Header({user}) {

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

  const headerLink = (path, text) => {
    const isActive = pathname === path;
    const fontClass = isActive ? "text-white font-bold text-sm" : "hover:font-bold text-sm text-gray-100";
    const textClass = isActive ? "text-white text-sm" : "hover:text-white text-gray-100 text-sm";

    return (
      <Link href={path} className={`text-lg w-20 h-9 ${fontClass} ${textClass} group rounded-md p-3 ring-slate-200 no-underline px-5`}>
        {text}
      </Link>
    );
  };



  /*
  
  */
  return (
    <div className = "flex justify-items-center dark:bg-zinc-900">

      {/*  Left Side  */}
      <div className="m-2 flex grow items-center px-10">
            <Link href="/home">
              <img src="/noBackgroundArkhaiosLogo.png" width={50} height={70}/>
            </Link>
            
      </div>

      {/*  Center  */}
      <div className="m-2 flex grow items-center pr-5">
        <Search/>
      </div>
      {/*  Right Side  */}
    
      <div className="flex px-10 pr-10">
        <div className="flex px-10 justify-items-center items-center mt-5 mb-6 dark:text-slate-300">
        
        
        <label className = "px-10 text-xs">{headerLink("/friends", "FRIENDS")}</label>
          
          <button className =  "flex justify-center">
            <label>{headerLink("/inbox", "INBOX")}</label>
            <div className="badge">+99</div>      
          </button>
          
        
          
        
        </div>
      </div>

      {/*  Right Side  */}
    
      <div className="flex items-center pr-10">
        <div className='pt-5'>
        </div>
        
        <div className="flex items-center pr-10 dark:fill:slate-300">
          
        </div>
        
        <div className="flex items-center">
          <div className = "flex justify-items-center">
            <Link href = "/account">
            <button className="rounded-full p-1  text-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </button>
            </Link>
          </div>
          <div className="pl-2 text-center dark:text-slate-300">
            {user.firstName}
          </div>
        </div>
        </div>
    </div>
  );

}