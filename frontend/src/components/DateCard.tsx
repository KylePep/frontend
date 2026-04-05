export default function DateCard({ date }: { date: DateItem }) {
  return (
    <li className="mb-2 border border-sky-300 p-2 rounded-xl">
      <span>Created by: {date.user.name}</span>
      <hr />
      <strong>{date.title}</strong>: {date.description}{" "}
      {date.is_public ? "(Public)" : "(Private)"}
    </li>
  );
}

export function MyDateCard({ date }: { date: DateItem }) {
  return (
    <li className="mb-2 border border-sky-300 p-2 rounded-xl">
      <strong>{date.title}</strong>: {date.description}{" "}
      {date.is_public ? "(Public)" : "(Private)"}
    </li>
  );
}