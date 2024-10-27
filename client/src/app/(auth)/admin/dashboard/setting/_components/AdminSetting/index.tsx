"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import { updateAction } from "./action";

type Schedule = {
  data:
    | {
        dayOfWeek: number;
        start: string;
        isEnabled: boolean;
      }[]
    | null;
};

export const AdminSetting = ({ schedule }: { schedule: Schedule }) => {
  const [settings, setSettings] = useState<NonNullable<Schedule["data"]>>(
    schedule.data?.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      start: s.start,
      isEnabled: s.isEnabled,
    })) || [
      {
        dayOfWeek: 0,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 1,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 2,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 3,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 4,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 5,
        start: "21:00",
        isEnabled: true,
      },
      {
        dayOfWeek: 6,
        start: "21:00",
        isEnabled: true,
      },
    ]
  );

  const handleChange = (dayOfWeek: number, value: string, isEnabled: boolean) => {
    setSettings((prev) =>
      [
        ...prev.filter((d) => d.dayOfWeek !== dayOfWeek),
        {
          dayOfWeek,
          start: value,
          isEnabled,
        },
      ].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    );
  };

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const handleCheckbox = (dayOfWeek: number, isEnabled: boolean) => {
    setSettings((prev) =>
      [
        ...prev.filter((d) => d.dayOfWeek !== dayOfWeek),
        {
          dayOfWeek,
          start: prev.find((d) => d.dayOfWeek === dayOfWeek)?.start || "21:00",
          isEnabled,
        },
      ].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    );
  };

  const onUpdate = async () => {
    await updateAction(schedule.data, settings);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-7'>
      <h1 className='text-3xl font-bold'>1on1設定(管理者)</h1>
      <div className='flex flex-col bg-white rounded-md p-3 text-black m-3 w-[50%]'>
        <div className='flex flex-col gap-8'>
          <div className='flex gap-2 flex-col'>
            <label className='text-lg font-semibold border-b pb-2 mb-2'>開始時間</label>
            {settings.map((day) => (
              <div key={day.dayOfWeek} className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <label>{dayNames[day.dayOfWeek]}</label>
                  <label className='inline-flex items-center cursor-pointer'>
                    <input type='checkbox' className='sr-only peer' readOnly checked={day.isEnabled} />
                    <div
                      onClick={() => handleCheckbox(day.dayOfWeek, !day.isEnabled)}
                      className='relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white  after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600'
                    />
                  </label>
                </div>
                <input
                  type='time'
                  className='w-full p-2 border rounded'
                  value={day.start}
                  onChange={(e) => handleChange(day.dayOfWeek, e.target.value, day.isEnabled)}
                  disabled={!day.isEnabled}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={onUpdate}>更新する</Button>
    </div>
  );
};
