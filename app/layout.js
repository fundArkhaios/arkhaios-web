import { cookies, headers } from "next/headers";
import authenticate from "../util/authenticate";
import Redirect from "./components/redirect";
import { redirect } from "next/navigation";
import "./globals.css";
import { GeistSans } from "geist/font/sans";

import Header from "./header";
import { UserContextProvider } from "./UserContext";
import SideBar from "./sidebar";
export const metadata = {
  title: "Arkhaios",
  description: "Arkhaios",
};

export default async function RootLayout({ children }) {
  const loginPaths = ["/", "/login", "/signup", "/recovery"];

  const path = headers().get("x-url");
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const session = cookieStore.get("session")?.value;

  const user = await authenticate.login(email, session);

  if (!user && !loginPaths.includes(path)) {
    redirect("/login");
  } else if (user) {
    if (loginPaths.includes(path)) {
      redirect("/home");
    } else if (!user.emailVerified && path !== "/verification") {
      // console.log("TRIGGERED");
      // redirect("/");
    }
  }

  const renderAuthenticatedContent = () => (
    <UserContextProvider user={user}>
      <div>
        <nav className="border-b border-amber-100 relative group">
          {" "}
          {/* <- You can add a border by putting 'border-b-2'*/}
          <Header user={user} />
        </nav>
        <div className="grid grid-cols-[64px_1fr]">
          <aside style={{ width: "64px" }}>
            <SideBar/>
          </aside>
          <div>{children}</div>
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
        <Redirect authenticated={!!user} />
        {user ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
      </body>
    </html>
  );
}
