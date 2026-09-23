"use client";

import Link from "next/link";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { ItemListItem } from "@/types/item";

type ItemTableProps = {
  items: ItemListItem[];
  deletingID: number | null;
  onDelete: (itemID: number) => void;
};

export default function ItemTable({ items, deletingID, onDelete }: ItemTableProps) {
  return (
    <TableContainer>
      <Table aria-label="Item master list">
        <TableHead><TableRow sx={{ bgcolor: "grey.50" }}><TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Sales Rate</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Discount</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell></TableRow></TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.itemID} hover>
              <TableCell>{item.itemName}</TableCell>
              <TableCell align="right">{item.salesRate}</TableCell>
              <TableCell align="right">{item.discountPct}%</TableCell>
              <TableCell align="right">
                <Button component={Link} href={`/items/${item.itemID}`} size="small" startIcon={<EditOutlinedIcon />} sx={{ textTransform: "none" }}>Edit</Button>
                <Button size="small" color="error" disabled={deletingID === item.itemID} onClick={() => onDelete(item.itemID)} startIcon={<DeleteOutlinedIcon />} sx={{ textTransform: "none" }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
