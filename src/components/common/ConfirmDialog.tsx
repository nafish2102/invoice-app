"use client";

import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({ open, title, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>{title}</DialogTitle>
      <DialogActions sx={{ p: 2, textAlign: "center", justifyContent: "center" }}>
        <Button onClick={onCancel} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm} sx={{ textTransform: "none" }}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
