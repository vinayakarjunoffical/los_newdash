const users = [
  { id: 1, email: "admin@test.com", mobile: "9999000001", password: "123456", otp: "111111", role: "admin" },
  { id: 2, email: "verification@test.com", mobile: "9999000002", password: "123456", otp: "222222", role: "verification" },
  { id: 3, email: "fi@test.com", mobile: "9999000003", password: "123456", otp: "333333", role: "fi" },
  { id: 4, email: "risk_ssessment@test.com", mobile: "9999000004", password: "123456", otp: "444444", role: "risk_ssessment" },
];

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ email: user.email }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
