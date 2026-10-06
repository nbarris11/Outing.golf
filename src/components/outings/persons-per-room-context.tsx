"use client";
import { createContext, useContext, useState, useTransition } from "react";
import { saveRoomOccupancy } from "@/lib/actions/trip-plan";
const Context = createContext({
  personsPerRoom: 2,
  setPersonsPerRoom: (_n: number) => {},
  pending: false,
  canEdit: false,
});
export function PersonsPerRoomProvider({
  children,
  outingId,
  initialValue = 2,
  canEdit = false,
}: {
  children: React.ReactNode;
  outingId?: string;
  initialValue?: number;
  canEdit?: boolean;
}) {
  const [personsPerRoom, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function setPersonsPerRoom(n: number) {
    if (!canEdit || pending) return;
    const previous = personsPerRoom;
    setValue(n);
    setError("");
    startTransition(async () => {
      try {
        if (outingId) await saveRoomOccupancy(outingId, n);
      } catch {
        setValue(previous);
        setError("Room occupancy could not be saved. Please try again.");
      }
    });
  }
  return (
    <Context.Provider
      value={{ personsPerRoom, setPersonsPerRoom, pending, canEdit }}
    >
      {error && (
        <p role="alert" className="p-3 text-center text-red-700">
          {error}
        </p>
      )}
      {children}
    </Context.Provider>
  );
}
export function usePersonsPerRoom() {
  return useContext(Context);
}
