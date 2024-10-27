"use server";

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

export const handleAction = async (
  form: Form | null,
  settings: {
    userId: string;
    startTime: string;
    endTime: string;
    frequency: string;
    isSameRoleMatch: boolean;
    isSameUserMatch: boolean;
  }
) => {
  console.log(settings.userId);
  if (!form?.data) {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/form`, {
      method: "POST",
      body: JSON.stringify({ ...settings, userId: settings.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/form/${form.data.userId}`, {
      method: "PUT",
      body: JSON.stringify({ ...settings, userId: settings.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
