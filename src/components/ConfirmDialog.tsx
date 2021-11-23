import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface ConfirmDialogProps {
  title: string;
  isOpen?: boolean;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmDialog({
  title,
  content,
  confirmText,
  cancelText,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Dialog open={isOpen || false} onClose={() => onClose?.()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          {confirmText || "Confirm"}
        </Button>
        <Button onClick={handleCancel} color="error" variant="contained">
          {cancelText || "Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
