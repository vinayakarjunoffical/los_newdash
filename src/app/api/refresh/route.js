import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  try {
    const decoded = jwt.verify(refreshToken, SECRET);

    const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET, {
      expiresIn: "15m",
    });

    const res = NextResponse.json({ access: "new token issued" });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
