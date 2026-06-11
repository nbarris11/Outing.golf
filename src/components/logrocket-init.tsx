"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";

import { fetchMe } from "@/components/auth/use-me";

export function LogRocketInit() {
  useEffect(() => {
    LogRocket.init("rpxxno/outinggolf");

    fetchMe().then(({ profile }) => {
      if (profile) {
        LogRocket.identify(profile.id, {
          name: profile.fullName,
          email: profile.email
        });
      }
    });
  }, []);

  return null;
}
