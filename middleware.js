import { NextResponse } from 'next/server';

export function middleware(request) {

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url.substring(request.url.lastIndexOf('/')));
    
    let { pathname } =  request.nextUrl;
    const host = request.headers.get('host');
    console.log("host: " + host)
    console.log("pathname: " + pathname)
    const subdomain = host.split('.')[0];
    console.log("MIDDLE")


    const fundsPathPrefix = '/funds-home';
    const mainPathPrefix = '/root-home';

    
    // Skip middleware for static assets by checking the file extension
    if (pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check if the subdomain is 'funds' and if the pathname does not already start with the fundsPathPrefix
    if (subdomain.includes('funds') && !pathname.startsWith(fundsPathPrefix)) {

        
        if (pathname.startsWith(mainPathPrefix)) {
            pathname = pathname.replace(mainPathPrefix, '');
        }

        console.log("Fund Reroute: " + `${fundsPathPrefix}${pathname}`)

        // Rewrite the URL to start with '/funds-home'
        return NextResponse.rewrite(new URL(`${fundsPathPrefix}${pathname}`, request.url));
    } 
    // Check if there is no subdomain or it is 'www', and if the pathname does not already start with the mainPathPrefix
    else if ((subdomain.includes('www') || subdomain.includes('')) && !pathname.startsWith(mainPathPrefix)) {

        if (pathname.startsWith(fundsPathPrefix)) {
            pathname = pathname.replace(fundsPathPrefix, '');
        }

        console.log("Normal Reroute: " + `${mainPathPrefix}${pathname}`)

        // Rewrite the URL to start with '/root-home'
        return NextResponse.rewrite(new URL(`${mainPathPrefix}${pathname}`, request.url));
    }

    return NextResponse.next({
        request: {
            // Apply new request headers
            headers: requestHeaders,
        }
    });

}