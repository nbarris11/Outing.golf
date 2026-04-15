"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";

interface LogRocketUser {
  id: string;
  email: string;
  name: string;
}

interface Props {
  user?: LogRocketUser | null;
}

export function LogRocketInit({ user }: Props) {
  useEffect(() => {
    LogRocket.init("rpxxno/outinggolf");
  }, []);

  useEffect(() => {
    if (user) {
      LogRocket.identify(user.id, {
        name: user.name,
        email: user.email
      });
    }
  }, [user?.id]);

  return null;
}
