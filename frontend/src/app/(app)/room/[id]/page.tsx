"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useEcho from "@/hooks/echo";
import { axios } from "@/lib/axios";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id;
  const echo = useEcho();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const router = useRouter();

  // Fetch existing messages
  const fetchMessages = async () => {
    const res = await axios.get(`/api/rooms/${roomId}/messages`);
    setMessages(res.data);
  };

  const leaveRoom = async () => {
    await axios.post(`/api/rooms/${roomId}/leave`);
    router.push('/lobby');
  };


  useEffect(() => {
    if (!roomId) return;
    fetchMessages();
  }, [roomId]);

  // Subscribe to Echo
  useEffect(() => {
    if (!echo || !roomId) return;

    const channel = echo.private(`room.${roomId}`)
      .listen('.RoomMessageSent', (event: any) => {
        setMessages(prev => [...prev, event.message]);
      });

    return () => {
      channel.stopListening('.RoomMessageSent');
    };
  }, [echo, roomId]);

  const sendMessage = async () => {
    if (!newMsg) return;
    await axios.post(`/api/rooms/${roomId}/messages`, { message: newMsg });
    setNewMsg('');
  };

  return (
    <div>
      <button onClick={leaveRoom}>Leave Room</button>

      <h1>Room {roomId}</h1>
      {messages.length > 0 ? (
        <div>
          {messages.map((m, i) => (
            <div key={i}><strong>{m.user?.name}:</strong> {m.message}</div>
          ))}
        </div>
      ) : (
        <div>No messages</div>
      )}
      <input value={newMsg} onChange={e => setNewMsg(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
