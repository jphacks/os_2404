import { cookies } from "next/headers";
import { SettingForm } from "./_components/SettingForm";
import { redirect } from "next/navigation";

type Form = {
  data: {
    userId: string;
    frequency: string;
    startDate: string;
    endDate: string;
    isSameRoleMatch: boolean;
    isSameUserMatch: boolean;
  };
};

const SettingPage = async () => {
  const cookie = await cookies();
  const me = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`, {
    mode: "cors",
    credentials: "include",
    headers: { cookie: cookie.get("accessToken")?.value as string },
  })
    .then((res) => res.json())
    .catch(() => redirect("/"));
  const userId = me.id;

  const form: Form = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/form/${userId}`)
    .then((res) => res.json())
    .catch(() => redirect("/"));

  return <SettingForm userId={userId} form={form} />;
};

export default SettingPage;
