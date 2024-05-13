"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function loginAction(
  currentState: any,
  formData: FormData
): Promise<string> {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(email)
  console.log(password)


  const res = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  cookies().set('Authorization', json.token, {
    secure: true,
    httpOnly: true,
    expires: Date.now() + 24 * 60 * 60 * 1000 * 3,
    path: "/",
    sameSite: "strict",
  });


  if (res.ok) {
    redirect("/cabinet/cards")

  } else {
    return json.error;
  }
}