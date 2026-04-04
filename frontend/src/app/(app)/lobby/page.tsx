"use client";

import { useEffect } from 'react';
import useEcho from "@/hooks/echo.js"
import { useAuth } from '@/hooks/auth';

export default function Lobby() {
  const { user } = useAuth({ middleware: 'auth' })
  const echo = useEcho()

  useEffect(() => {
    if (echo) {
      echo.private(`chat.${user?.id}`)
        .listen('MessageSent', (event) => {
          console.log('Real-time event received: ', event)
        })
    }
  });


  return <div>Lobby</div>;
}