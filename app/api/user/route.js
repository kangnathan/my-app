import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const cookie = cookies().get("mycrudapp");
    const theCookie = cookie ? cookie.value : null;

    if (theCookie) {
      const jwtSecret = process.env.JSWTOKEN;

      if (!jwtSecret) {
        return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
      }

      const decoded = jwt.verify(theCookie, jwtSecret);
      return new Response(JSON.stringify(decoded), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "No token provided" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
}
