import { NextResponse } from 'next/server';

export function middleware(request) {

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url.substring(request.url.lastIndexOf('/')));
    
    return NextResponse.next({
        request: {
            // Apply new request headers
            headers: requestHeaders,
        }
    });

}