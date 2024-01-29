import { cookies, headers } from 'next/headers'
import authenticate from '../util/authenticate';
import Redirect from './components/redirect';
import { redirect } from 'next/navigation'
// import { useRouter } from 'next/router';
import Header from './header';

export const metadata = {
  title: 'Arkhaios',
  description: 'Arkhaios',
} 




export default async function RootLayout({ children }) {

    // const router = useRouter();
    // const { pathname } = router;

    const loginPaths = ["/", "/signup"];
  
    const path = headers().get("x-url");
    const cookieStore = cookies();
    const email = cookieStore.get('email')?.value;
    const session = cookieStore.get('session')?.value;

    const user = await authenticate.login(email, session);
    
    

    if (!user && !loginPaths.includes(path)) {
        redirect("/signup");
    } else if (user) {
      if (loginPaths.includes(path)) {
        redirect("/home");
      } else if (!user.emailVerified && path !== "/verification") {
        redirect("/");
      }
    }

  const renderAuthenticatedContent = () => (
    <div className="">
      <nav className="border-b-2 relative group">  
          <Header user={user} />
      </nav>
      {children} 
    </div>
  );

  const renderUnauthenticatedContent = () => (<>{children}</>);

 return (
  <html lang="en">
    <title>Arkhaios</title>
    <link rel="icon" type="image/x-icon" href="/trimmedNoBackgroundHDArkhaiosLogo.ico"></link>	
    <body>
      <Redirect authenticated={!!user} />
        {user && user.emailVerified ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
    </body>
  </html>
  )
}
