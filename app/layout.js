import { cookies, headers } from "next/headers";
import authenticate from "../util/authenticate";
import Redirect from "./components/redirect";
import { redirect } from "next/navigation";
import "./globals.css";
import { Josefin_Sans } from '@next/font/google';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// import { useRouter } from 'next/router';
import Header from "./header";
import { UserContextProvider } from "./UserContext";

export const metadata = {
  title: "Arkhaios",
  description: "Arkhaios",
};

export default async function RootLayout({ children }) {
  // const { user } = useContext(UserContext)

  // const router = useRouter();
  // const { pathname } = router;

  const loginPaths = ["/", "/login", "/signup", "/recovery"];

  const path = headers().get("x-url");
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const session = cookieStore.get("session")?.value;

  const user = await authenticate.login(email, session);
  //console.log(JSON.stringify(user));
  console.log("Path: " + path);

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
      <div className="">
        <nav className="border-b border-amber-100 relative group">
          {" "}
          {/* <- You can add a border by putting 'border-b-2'*/}
          <Header user={user} />
        </nav>
        {children}
      </div>
    </UserContextProvider>
  );

  const renderUnauthenticatedContent = () => <>{children}</>;

  return (
    <html data-theme="customBlackTheme" lang="en">
      <title>Arkhaios</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="/trimmedNoBackgroundHDArkhaiosLogo.ico"
      ></link>
      <body className = {josefin.className}>
        <Redirect authenticated={!!user} />
        {user ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
      </body>
    </html>
  );
}
