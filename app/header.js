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
    var fontClass = "text-sm font-extrabold interFont"; // Boldneess
    const textClass = isActive ? "text-amber-100" : "text-white hover:text-amber-100"; // Color
    
    if (text == "ARKHAIOS") {
      fontClass = "font-black text-lg"
    }

    return (
      <Link href={path} className={`w-20 h-9 ${fontClass} ${textClass} no-underline px-5`}>
        {text}
      </Link>
    );
  };



  /*
  
  */
  return (
    <div className = "flex justify-items-center bg-color-black">

      {/*  Left Side  */}
      <div className="m-2 flex grow items-center px-10">
        <div>
        { headerLink("/home", "ARKHAIOS")}
        </div>
        
        {/*<img src="/noBackgroundArkhaiosLogo.png" width={50} height={70}/>*/}            
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
        <div className="pl-2 text-center">
            { headerLink("/account/profile", user.firstName.toUpperCase() + " " + user.lastName.toUpperCase())}          
        </div>
        </div>
    </div>
  );

}