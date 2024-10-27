"use server";

type Schedule = {
  dayOfWeek: number;
  start: string;
  isEnabled: boolean;
};

export const updateAction = async (prev: Schedule[] | null, schedules: Schedule[]) => {
  console.log(schedules);
  if (prev) {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule`, {
      method: "PUT",
      body: JSON.stringify(schedules),
    });
  } else {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule`, {
      method: "POST",
      body: JSON.stringify(schedules),
    });
  }
};
