// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET || "supersecretkey";

// export async function middleware(req) {
//   // const token = localStorage.getItem("accessToken")
//    const token = req.cookies.get("accessToken")?.value;

//   console.log("token ",token)

//   if (!token) {
//     console.log("token not found")
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);

//     const { pathname } = req.nextUrl;


//     return NextResponse.next();
//   } catch (err) {
//     // Try refreshing token
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*","/login"], // Protect all dashboard routes
// };


import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    console.log("jwt not work")
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token with jose (works on Edge)
    await jwtVerify(token, SECRET);

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect only dashboard routes
};
