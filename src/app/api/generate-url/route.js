import { NextResponse } from "next/server";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export async function POST() {
  try {
    const res = await fetch("https://common.sandbox.unaport.com/api/v1/public/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailId: "developer@unacores.com", 
        password: "Q7gCljuppDnP0po"
      })
    });

    const data = await res.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 });
    }

    // 2. Build config JSON
    const config = {
      theme: {
        background: "#131313",
        accent: "#1B1B1B",
        primary: "#7762FF",
        primaryText: "#FFFFFF",
        primaryButtonText: "131313",
        secondary: "#C589E4",
        secondaryText: "#F2F2F2",
        disabled: "#1F1F1F",
        disabledText: "#FEFEFE",
        border: "#767676",
        hintText: "#9e9e9e",
        errorText: "#d32f2f",
        loaderColor: "#F2F2F2",
        fontName: "Open Sans"
      },
      productId: "529684db-7241-44d7-95a3-fdc4ee9f8c11",
      phoneNumber: "7977458177",
      trackingId: "9999999999",
      fiuId: "UNACORES-FIU-UAT",
      FIType: "Deposits",
      accessToken,
      refreshToken
    };

    // 3. Encode to Base64
    const encoded = Buffer.from(JSON.stringify(config)).toString("base64");

    // 4. Build final URL
    const finalUrl = `https://sdk.sandbox.unaport.com/view?config=${encoded}`;

    return NextResponse.json({ finalUrl });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
