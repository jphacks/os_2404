"use client";

import { Button } from "@/components/Button";
import { useState } from "react";

const AdminSettingPage = () => {
  const [settings, setSettings] = useState({
    monday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    tuesday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    wednesday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    thursday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    friday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    saturday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
    sunday: { startTime: "21:00", endTime: "22:00", isEnabled: true },
  });
  const handleChange = (type: "startTime" | "endTime", day: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [day as keyof typeof settings]: { ...prev[day as keyof typeof settings], [type]: value },
    }));
  };

  const dayNames = ["月", "火", "水", "木", "金", "土", "日"];

  const handleCheckbox = (day: string) => {
    setSettings((prev) => ({
      ...prev,
      [day as keyof typeof settings]: {
        startTime: "",
        endTime: "",
        isEnabled: !prev[day as keyof typeof settings].isEnabled,
      },
    }));
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-7'>
      <h1 className='text-3xl font-bold'>1on1設定(管理者)</h1>
      <div className='flex flex-col bg-white rounded-md p-3 text-black m-3 w-[50%]'>
        <div className='flex flex-col gap-8'>
          <div className='flex gap-2 flex-col'>
            <label className='text-lg font-semibold border-b pb-2 mb-2'>開始/終了時間</label>
            {Object.keys(settings).map((day, index) => (
              <div key={day} className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <label htmlFor={day}>{dayNames[index]}</label>
                  <label className='inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      className='sr-only peer'
                      readOnly
                      checked={settings[day as keyof typeof settings].isEnabled}
                    />
                    <div
                      onClick={() => handleCheckbox(day)}
                      className='relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white  after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600'
                    />
                  </label>
                </div>
                <div className='flex gap-3'>
                  <input
                    type='time'
                    className='w-full p-2 border rounded'
                    value={settings[day as keyof typeof settings].startTime}
                    onChange={(e) => handleChange("startTime", day, e.target.value)}
                    disabled={!settings[day as keyof typeof settings].isEnabled}
                  />
                  <input
                    type='time'
                    className='w-full p-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed'
                    value={settings[day as keyof typeof settings].endTime}
                    onChange={(e) => handleChange("endTime", day, e.target.value)}
                    disabled={!settings[day as keyof typeof settings].isEnabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button>更新する</Button>
    </div>
  );
};

export default AdminSettingPage;
