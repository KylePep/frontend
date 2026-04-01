"use client";

import CreateDateForm from "@/app/components/createDateForm";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface DateItem {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  user: {
    id: number;
    name: string;
  };
}

export default function DatePage() {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [myDates, setMyDates] = useState<DateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await api.get<{ public: DateItem[], mine: DateItem[] }>("/api/dates", {
          withCredentials: true,
        });
        setDates(res.data.public);
        setMyDates(res.data.mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDates();
  }, []);

  const handleNewDate = (date: DateItem) => {
    setMyDates(prev => [date, ...prev]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen gap-8 p-4">
      {/* Left: Form + My Dates */}
      <div className="flex-1 flex flex-col gap-4">
        <CreateDateForm onDateCreated={handleNewDate} />

        <section>
          <h2 className="font-bold text-lg mb-2">My Dates</h2>
          {myDates.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {myDates.map(date => (
                <li key={date.id} className="mb-2 border border-sky-300 p-2 rounded-xl">
                  <strong>{date.title}</strong>: {date.description}{" "}
                  {date.is_public ? "(Public)" : "(Private)"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No dates yet.</p>
          )}
        </section>
      </div>

      {/* Right: All Public Dates */}
      <div className="flex-1">
        <h2 className="font-bold text-lg mb-2">All Public Dates</h2>
        {dates.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {dates.map(date => (
              <li key={date.id} className="mb-2 border border-sky-300 p-2 rounded-xl">
                <span>Created by: {date.user.name}</span>
                <hr />
                <strong>{date.title}</strong>: {date.description}{" "}
                {date.is_public ? "(Public)" : "(Private)"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No public dates yet.</p>
        )}
      </div>
    </div>
  );
}
