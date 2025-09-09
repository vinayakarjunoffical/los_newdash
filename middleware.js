// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET || "supersecretkey";

// export async function middleware(req) {
//   const token = req.cookies.get("accessToken")?.value;

//   console.log("token ",token)

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);

//     const { pathname } = req.nextUrl;

//     // Role-based redirect
//     if (pathname.startsWith("/dashboard/admin") && decoded.role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard/user", req.url));
//     }
//     if (pathname.startsWith("/dashboard/manager") && decoded.role !== "manager") {
//       return NextResponse.redirect(new URL("/dashboard/user", req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     // Try refreshing token
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protect all dashboard routes
// };
