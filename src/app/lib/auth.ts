"use server"
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session', error)
  }
}

export async function createSession(username: string, roles:string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ username, roles, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  cookies().delete('session')
  redirect("/")
}


// "use server"
// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// const secretKey = process.env.SESSION_SECRET;
// const encodedKey = new TextEncoder().encode(secretKey);

// // Function to encrypt the payload into a JWT token
// export async function encrypt(payload: any) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("1d") // Token valid for 1 day
//     .sign(encodedKey);
// }

// // Function to decrypt and verify the JWT token
// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.error("Failed to verify session", error);
//     // Clear the session cookie if decryption fails
//     cookies().delete("session");
//     return null;
//   }
// }

// // Function to create a new session
// export async function createSession(username: string, roles: string) {
//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
//   const session = await encrypt({ username, roles, expiresAt });

//   // Setting the session cookie
//   cookies().set("session", session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//     expires: expiresAt,
//     sameSite: "strict", // Use 'strict' for better security
//     path: "/",
//   });
// }

// // Function to update the existing session
// export async function updateSession() {
//   const session = cookies().get("session")?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) {
//     return null;
//   }

//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend expiration by 1 day
//   const updatedSession = await encrypt({ ...payload, expiresAt });

//   // Update the session cookie with new expiration
//   cookies().set("session", updatedSession, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     expires: expiresAt,
//     sameSite: "strict",
//     path: "/",
//   });
// }

// // Function to delete the session
// export async function deleteSession() {
//   cookies().delete("session");
//   // Redirect to home or login page after session deletion
//   redirect("/");
// }
