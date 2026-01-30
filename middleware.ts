import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSessionServer } from "./lib/api/serverApi";

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
    const cookiesStoreData = await cookies();
    const accessToken = cookiesStoreData.get('accessToken')?.value;
    const refreshToken = cookiesStoreData.get('refreshToken')?.value;
    
    const { pathname } = request.nextUrl;
    
    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    if (isPrivateRoute) {
        if (!accessToken) {
            if (refreshToken) {
                try {
                    // Get new cookies
                    const data = await checkSessionServer();
                    const setCookie = data.headers['set-cookie'];

                    if (setCookie) {
                        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

                        for (const cookieStr of cookieArray) {
                            const parsed = parse(cookieStr);
                            const options = {
                                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                                path: parsed.Path,
                                maxAge: Number(parsed['Max-Age']),
                            };

                            if (parsed.accessToken) cookiesStoreData.set('accessToken', parsed.accessToken, options);
                            if (parsed.refreshToken) cookiesStoreData.set('refreshToken', parsed.refreshToken, options);
                        }

                        // If session is still active and this is a public route
                        if (isPublicRoute) {
                            return NextResponse.redirect(new URL('/', request.url), {
                                headers: {
                                    Cookie: cookiesStoreData.toString(), // ✅ Fixed
                                },
                            });
                        }

                        // If session is active and this is a private route
                        if (isPrivateRoute) {
                            return NextResponse.next({
                                headers: {
                                    Cookie: cookiesStoreData.toString(), // ✅ Fixed
                                },
                            });
                        }
                    }
                } catch (error) {
                    // Session refresh failed
                    if (isPrivateRoute) {
                        return NextResponse.redirect(new URL('/sign-in', request.url));
                    }
                }
            }

            // If no refreshToken or session
            if (isPublicRoute) {
                return NextResponse.next();
            }

            // Private route without auth - redirect to sign-in
            if (isPrivateRoute) {
                return NextResponse.redirect(new URL('/sign-in', request.url));
            }
        }
    
        // If accessToken exists
        if (isPublicRoute) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        
        if (isPrivateRoute) {
            return NextResponse.next();
        }
    }
}

export const config = { 
    matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'] 
}