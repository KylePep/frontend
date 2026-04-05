"use client";

import DateCard, { MyDateCard } from "@/components/DateCard";
import CreateDateForm from "@/components/CreateDateForm";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";

export default function DatePage() {
  // const [otherDates, setOtherDates] = useState<DateItem[]>([]);
  const [friendDates, setFriendDates] = useState<DateItem[]>([]);
  const [myDates, setMyDates] = useState<DateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await axios.get<{ public_others: DateItem[], public_friends: DateItem[], mine: DateItem[] }>("/api/dates", {
          withCredentials: true,
        });

        // setOtherDates(res.data.public_others);
        setFriendDates(res.data.public_friends);
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
                <MyDateCard key={date.id} date={date} />
              ))}
            </ul>
          ) : (
            <p>No dates yet.</p>
          )}
        </section>
      </div>

      {/* Right: All Public Dates */}
      <div className="flex-1">
        <h2 className="font-bold text-lg mb-2"> Friend's Public Dates</h2>
        {friendDates.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {friendDates.map(date => (
              <DateCard key={date.id} date={date} />
            ))}
          </ul>
        ) : (
          <p>No public dates yet.</p>
        )}
        {/* <h2 className="font-bold text-lg mb-2">Other's Public Dates</h2>
        {otherDates.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {otherDates.map(date => (
              <DateCard key={date.id} date={date} />
            ))}
          </ul>
        ) : (
          <p>No public dates yet.</p>
        )} */}
      </div>
    </div>
  );
}
