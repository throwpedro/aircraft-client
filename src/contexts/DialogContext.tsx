import { createContext, useContext, useState } from "react";

type DialogContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const value = { open, setOpen };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

const useDialogOpen = () => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("useDialogOpen must be used within a DialogProvider");
  }
  return [context.open, context.setOpen] as const;
};

export { DialogProvider, useDialogOpen };
