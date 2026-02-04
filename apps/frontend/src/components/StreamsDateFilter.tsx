'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StreamsDateFilterProps {
  initialDate: string;
}

export default function StreamsDateFilter({ initialDate }: StreamsDateFilterProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    router.push(`/streams?date=${newDate}`);
  };

  return (
    <div className="card mb-8">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

