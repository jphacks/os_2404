import { AdminSetting } from "./_components/AdminSetting";

type Schedule = {
  data: {
    dayOfWeek: number;
    start: string;
    isEnabled: boolean;
  }[];
};

const AdminSettingPage = async () => {
  const schedule: Schedule = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule`, {
    method: "GET",
    cache: "no-store",
  })
    .then((res) => res.json())
    .catch((e) => console.error("Failed to fetch schedule", e));
  console.log("---------------------------------------------------------------");
  console.log(schedule);
  console.log("---------------------------------------------------------------");
  return <AdminSetting schedule={schedule} />;
};

export default AdminSettingPage;
