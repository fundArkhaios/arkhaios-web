import { cookies, headers } from "next/headers";
import authenticate from "../../util/authenticate";
import Redirect from "./components/redirect";
import { redirect } from "next/navigation";
import "./../globals.css";
import { GeistSans } from "geist/font/sans";
import { NextResponse} from 'next/server';
import Header from "../root-home/header";
import { UserContextProvider } from "../root-home/UserContext";
import SideBar from "./sidebar";
export const metadata = {
  title: "Arkhaios",
  description: "Arkhaios",
};


export default async function RootLayout({ children }) {

  const loginPaths = ["/", "/login", "/signup", "/recovery", "/root-home", "/funds-home"];

  const path = headers().get("x-url");
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const session = cookieStore.get("session")?.value;


  var user = await authenticate.login(email, session);
  
  if (user) {
    // Remove salt, iter, verificationCode, plaidID 
    const keysToFilter = ['salt', 'iter', 'verificationCode', 'plaidID'];

    // console.log("Before filter User: " + JSON.stringify(user));
    user = Object.keys(user).reduce((newUser, key) => {
      if (!keysToFilter.includes(key)) {
        newUser[key] = user[key];
      }
      return newUser;
    }, {});
    // console.log("After Filter User: " + JSON.stringify(user))
  }
  
  console.log("Path: " + path);
  
  var allowAuthenticated = false;
  if (!user && !loginPaths.includes(path) && path) {
    console.log("Layout.js Redirect!")
    redirect("/login");
  } else if (!user && (path == '/root-home' || path == '/funds-home')) {
    
    // Do nothing.
  } else if (user) {
    allowAuthenticated = true;
    if (loginPaths.includes(path)) {
      redirect("/home");
    } else if (!user.emailVerified) {
      allowAuthenticated = false;
      if (path != "/verify") {
        redirect("/signup/verify");
      }
      console.log("False Authenticated");
    }
  }

  console.log("Authenticated?" + allowAuthenticated);



  const renderAuthenticatedContent = () => (
    <UserContextProvider user={user}>
      <div>
        <nav className="border-b border-amber-100 relative group">
          {" "}
          {/* <- You can add a border by putting 'border-b-2'*/}
          <Header user={user} />
        </nav>
        <div className="grid grid-cols-[64px_1fr]">
          <aside className="bg-base-200 w-16">
            <SideBar className="bg-base-200" />
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </UserContextProvider>
  );

  const renderUnauthenticatedContent = () => <>{children}</>;

  return (
    <html
      data-theme="customBlackTheme"
      className={GeistSans.className}
      lang="en"
    >
      <title>Arkhaios</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="/trimmedNoBackgroundHDArkhaiosLogo.ico"
      ></link>
      <body className={GeistSans.className}>
        <Redirect authenticated={user} />
        {allowAuthenticated ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
      </body>
    </html>
  );
}
