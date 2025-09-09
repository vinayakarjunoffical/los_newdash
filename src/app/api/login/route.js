import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET || "supersecretkey";

// Dummy users with mobile, password, and OTP
const users = [
  { id: 1, email: "admin@test.com", mobile: "9999000001", password: "123456", otp: "111111", role: "admin" },
  { id: 2, email: "verification@test.com", mobile: "9999000002", password: "123456", otp: "222222", role: "verification" },
  { id: 3, email: "fi@test.com", mobile: "9999000003", password: "123456", otp: "333333", role: "fi" },
  { id: 4, email: "credit@test.com", mobile: "9999000004", password: "123456", otp: "444444", role: "credit" },
  { id: 5, email: "risk_ssessment@test.com", mobile: "9999000005", password: "123456", otp: "555555", role: "risk_ssessment" },
];

export async function POST(req) {
  const { email, mobile, password, otp, requestOtp } = await req.json();

  // Find user by email or mobile
  const user = users.find(
    (u) => (email && u.email === email) || (mobile && u.mobile === mobile)
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (requestOtp) {
    return NextResponse.json({
      message: `OTP for ${mobile} is ${user.otp} (demo)`,
    });
  }

  if (!password && !otp) {
    return NextResponse.json(
      { error: "Password or OTP required" },
      { status: 400 }
    );
  }

  if (password && user.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  if (otp && user.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // Generate tokens
  const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

  // ✅ Create response
  const response = NextResponse.json({
    userId: user.id,
    role: user.role,
    accessToken,
    refreshToken ,
    message: "Login successful",
  });

  // ✅ Attach cookies
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // important on Vercel (HTTPS)
    sameSite: "lax", // or "strict"
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}


//***************************add code******************************** */
// export async function POST(req) {
//   const { email, mobile, password, otp, requestOtp } = await req.json();

//   const user = users.find(u => (email && u.email === email) || (mobile && u.mobile === mobile));

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   if (requestOtp) {

//     return NextResponse.json({ message: `OTP for ${mobile} is ${user.otp} (demo)` });
//   }


//   if (!password && !otp) {
//     return NextResponse.json({ error: "Password or OTP required" }, { status: 400 });
//   }

//   if (password && user.password !== password) {
//     return NextResponse.json({ error: "Invalid password" }, { status: 401 });
//   }

//   if (otp && user.otp !== otp) {
//     return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
//   }

//   const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

//   return NextResponse.json({
//     userId: user.id,
//     role: user.role,
//     accessToken,
//     refreshToken,
//   });
// }


//******************************8-09-25 1.25****************************** */

// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const SECRET = process.env.JWT_SECRET || "supersecretkey";

// // Dummy users (plain text passwords for demo only!)
// const users = [
//   { id: 1, email: "admin@test.com", password: "123456", role: "admin" },
//   { id: 2, email: "verification@test.com", password: "123456", role: "verification" },
//   { id: 3, email: "fi@test.com", password: "123456", role: "fi" },
//   { id: 4, email: "risk_ssessment@test.com", password: "123456", role: "risk_ssessment" },
// ];

// export async function POST(req) {
//   const { email, password } = await req.json();
//   const user = users.find((u) => u.email === email);

//   if (!user || user.password !== password) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   }

//   const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "15m" });
//   const refreshToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

//   return NextResponse.json({
//     userId: user.id,
//     role: user.role,
//     accessToken,
//     refreshToken,
//   });
// }
