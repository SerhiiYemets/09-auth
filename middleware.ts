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
            // Отримуємо нові cookie
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

            // Якщо сесія все ще активна:
            // для публічного маршруту — виконуємо редірект на головну.
            if (isPublicRoute) {
                return NextResponse.redirect(new URL('/', request.url), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                });
            }

            //  для приватного маршруту — дозволяємо доступ
            // ередаємо нові cookie далі, щоб оновити їх у браузері
            if (isPrivateRoute) {
                return NextResponse.next({
                headers: {
                    Cookie: cookieStore.toString(),
                },
                });
            }
            }
        }

        // Якщо refreshToken або сесії немає:
        // публічний маршрут — дозволяємо доступ
        if (isPublicRoute) {
            return NextResponse.next();
        }

        // приватний маршрут — редірект на сторінку входу
        if (isPrivateRoute) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        }
    
        // Якщо accessToken існує:
        // публічний маршрут — виконуємо редірект на головну
        if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
        }
        
        // приватний маршрут — дозволяємо доступ
        if (isPrivateRoute) {
        return NextResponse.next();
        }
    }
}

export const config = { 
    matcher: 
    ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'] 
}