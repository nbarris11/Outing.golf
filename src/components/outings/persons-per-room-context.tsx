"use client";

import { createContext, useContext, useState } from "react";

interface PersonsPerRoomContextValue {
  personsPerRoom: number;
  setPersonsPerRoom: (n: number) => void;
}

const PersonsPerRoomContext = createContext<PersonsPerRoomContextValue>({
  personsPerRoom: 2,
  setPersonsPerRoom: () => {}
});

export function PersonsPerRoomProvider({ children }: { children: React.ReactNode }) {
  const [personsPerRoom, setPersonsPerRoom] = useState(2);
  return (
    <PersonsPerRoomContext.Provider value={{ personsPerRoom, setPersonsPerRoom }}>
      {children}
    </PersonsPerRoomContext.Provider>
  );
}

export function usePersonsPerRoom() {
  return useContext(PersonsPerRoomContext);
}
