import React, { createContext, useContext, useEffect, useState } from "react";
import ConfirmDialog, {
  ConfirmDialogProps,
} from "src/components/ConfirmDialog";

export interface ConfirmDialogContextProps {
  isOpen: boolean;
  setDialogProps: (value: ConfirmDialogProps) => void;
  setOpen: (open: boolean) => void;
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextProps>(
  {} as ConfirmDialogContextProps
);

export const ConfirmDialogProvider: React.FC<
  Partial<ConfirmDialogContextProps>
> = (props) => {
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps>({
    title: "",
    isOpen: false,
  });

  const setOpen = (open: boolean) => {
    setDialogProps({ ...dialogProps, isOpen: open });
  };

  return (
    <ConfirmDialogContext.Provider
      value={{
        isOpen: dialogProps.isOpen!,
        setDialogProps,
        setOpen,
      }}
    >
      {props.children}
      <ConfirmDialog
        title={dialogProps.title}
        isOpen={dialogProps.isOpen}
        onClose={() => setOpen(false)}
      />
    </ConfirmDialogContext.Provider>
  );
};

export function useConfirmDialog(props: ConfirmDialogProps) {
  const context = useContext(ConfirmDialogContext);

  useEffect(() => {
    context.setDialogProps({
      ...props,
      isOpen: props.isOpen || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isOpen: context.isOpen,
    setOpen: context.setOpen,
  };
}
