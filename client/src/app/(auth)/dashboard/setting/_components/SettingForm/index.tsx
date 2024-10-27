"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { handleAction } from "./action";

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

export const SettingForm = ({ userId, form }: { userId: string; form: Form | null }) => {
  const [frequency, setFrequency] = useState(form?.data.frequency || "every");
  const [isCheckedRole, setIsCheckedRole] = useState(form?.data.isSameRoleMatch || false);
  const [isCheckedSamePerson, setIsCheckedSamePerson] = useState(form?.data.isSameUserMatch || false);
  const [settings, setSettings] = useState({
    startTime: form?.data.startDate || "10:00",
    endTime: form?.data.endDate || "17:00",
  });
  const handleRole = () => setIsCheckedRole(!isCheckedRole);
  const handleSamePerson = () => setIsCheckedSamePerson(!isCheckedSamePerson);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await handleAction(form, {
      userId,
      ...settings,
      isSameRoleMatch: isCheckedRole,
      isSameUserMatch: isCheckedSamePerson,
      frequency,
    });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-semibold'>1on1設定</h1>
      <div className='flex flex-col bg-white rounded-md p-3 text-black m-3 w-[50%]'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='frequency'>頻度</label>
            <select
              id='frequency'
              className='border p-2 rounded-md'
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value='every'>毎回</option>
              <option value='half'>2回に1度</option>
              <option value='none'>行わない</option>
            </select>
          </div>

          <div className='flex gap-2 flex-col'>
            <label className='block font-medium'>開始/終了時間</label>
            <div className='flex flex-col gap-2'>
              <input
                type='time'
                className='w-full p-2 border rounded'
                value={settings.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <input
                type='time'
                className='w-full p-2 border rounded'
                value={settings.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='role'>同じロールの人と当たりやすくする</label>
            <div className='flex items-center'>
              <label className='inline-flex items-center cursor-pointer'>
                <input type='checkbox' className='sr-only peer' readOnly checked={isCheckedRole} />
                <div
                  onClick={handleRole}
                  className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='role'>当たったことのある人と当たりにくくする</label>
            <div className='flex items-center'>
              <label className='inline-flex items-center cursor-pointer'>
                <input type='checkbox' className='sr-only peer' readOnly checked={isCheckedSamePerson} />
                <div
                  onClick={handleSamePerson}
                  className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleSubmit}>更新する</Button>
    </div>
  );
};
