import { createContext, useContext, useState } from "react";

type AircraftIdContextValue = {
  aircraftId: string | null;
  setAircraftId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AircraftIdContext = createContext<AircraftIdContextValue | null>(
  null,
);

const AircraftIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [aircraftId, setAircraftId] = useState<null | string>(null);
  const value = { aircraftId, setAircraftId };

  return (
    <AircraftIdContext.Provider value={value}>
      {children}
    </AircraftIdContext.Provider>
  );
};

const useAircraftId = () => {
  const context = useContext(AircraftIdContext);
  if (context === null) {
    throw new Error("useAircraftId must be used within a AircraftIdProvider");
  }
  return [context.aircraftId, context.setAircraftId] as const;
};

export { AircraftIdProvider, useAircraftId };
