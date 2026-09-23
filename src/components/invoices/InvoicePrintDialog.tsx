"use client";

import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import type { InvoiceDetail } from "@/types/invoice";

type InvoicePrintDialogProps = {
  invoice: InvoiceDetail | null;
  loading: boolean;
  error: string;
  onClose: () => void;
};

export default function InvoicePrintDialog({ invoice, loading, error, onClose }: InvoicePrintDialogProps) {
  const formatAmount = (amount: number) => amount.toFixed(2);

  return (
    <Dialog open={loading || Boolean(invoice) || Boolean(error)} onClose={onClose} fullWidth maxWidth="md" slotProps={{ backdrop: { className: "print-dialog-backdrop" } }}>
      <DialogContent className="print-invoice-dialog" sx={{ p: { xs: 2, sm: 4 } }}>
        {loading && <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress size={28} /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {invoice && (
          <Box className="print-invoice-sheet">
            <Stack className="print-invoice-actions" direction="row" spacing={1} sx={{ justifyContent: "flex-end", mb: 3 }}>
              <Button onClick={onClose} sx={{ textTransform: "none" }}>Close</Button>
              <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()} sx={{ textTransform: "none" }}>Print Invoice</Button>
            </Stack>
            <Box sx={{ borderBottom: 2, borderColor: "primary.main", pb: 2, mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Invoice</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", mt: 1 }}>
                <Typography>Invoice #: <strong>{invoice.invoiceNo}</strong></Typography>
                <Typography>Date: <strong>{new Date(invoice.invoiceDate).toLocaleDateString()}</strong></Typography>
              </Stack>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Bill To</Typography>
              <Typography sx={{ fontWeight: 700 }}>{invoice.customerName}</Typography>
              {invoice.address && <Typography>{invoice.address}</Typography>}
              {invoice.city && <Typography>{invoice.city}</Typography>}
            </Box>
            <TableContainer>
              <Table aria-label="Invoice items">
                <TableHead><TableRow sx={{ bgcolor: "grey.100" }}><TableCell sx={{ fontWeight: 700 }}>Description</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Quantity</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Rate</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Discount</TableCell></TableRow></TableHead>
                <TableBody>{invoice.lines.map((line) => <TableRow key={line.rowNo}><TableCell>{line.description}</TableCell><TableCell align="right">{line.quantity}</TableCell><TableCell align="right">{formatAmount(line.rate)}</TableCell><TableCell align="right">{line.discountPct}%</TableCell></TableRow>)}</TableBody>
              </Table>
            </TableContainer>
            <Stack spacing={0.75} sx={{ alignItems: "flex-end", mt: 3 }}>
              <Typography>Subtotal: <strong>{formatAmount(invoice.subTotal)}</strong></Typography>
              <Typography>Tax ({invoice.taxPercentage}%): <strong>{formatAmount(invoice.taxAmount)}</strong></Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total: {formatAmount(invoice.invoiceAmount)}</Typography>
            </Stack>
            {invoice.notes && <Box sx={{ mt: 4 }}><Typography variant="subtitle2" color="text.secondary">Notes</Typography><Typography sx={{ whiteSpace: "pre-wrap" }}>{invoice.notes}</Typography></Box>}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
