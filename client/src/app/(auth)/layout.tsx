import { cookies } from "next/headers";
import { ReactNode } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = await cookies();
  const me = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`, {
    mode: "cors",
    credentials: "include",
    headers: { cookie: cookie.get("accessToken")?.value as string },
  })
    .then((res) => res.json())
    .catch(() => redirect("/"));

  return (
    <div>
      <div className='absolute top-5 right-5'>
        <Image src={me.avatar} className='rounded-full' alt='avatar' width={32} height={32} />
      </div>
      {children}
    </div>
  );
}
