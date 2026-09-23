"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { deleteItem, getItems } from "@/services/items";
import type { ItemListItem } from "@/types/item";
import AppShell from "@/components/layout/AppShell";
import ItemTable from "@/components/items/ItemTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function ItemsPage() {
  const [items, setItems] = useState<ItemListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingID, setDeletingID] = useState<number | null>(null);
  const [confirmDeleteID, setConfirmDeleteID] = useState<number | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setItems(await getItems(token));
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load items.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadItems();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.itemName.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [items, search],
  );

  const handleDelete = async () => {
    if (confirmDeleteID === null) return;
    const itemID = confirmDeleteID;
    setConfirmDeleteID(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setDeletingID(itemID);
    try {
      await deleteItem(itemID, token);
      setItems((currentItems) => currentItems.filter((item) => item.itemID !== itemID));
      setSuccess("Item deleted successfully.");
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "";
      setError(message.toLowerCase().includes("invoice")
        ? "This item is already used in an invoice and cannot be deleted."
        : message || "Unable to delete item.");
    } finally {
      setDeletingID(null);
    }
  };

  return (
    <AppShell title="Items">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 3 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Items</Typography>
            <Typography color="text.secondary">Manage your item master list.</Typography>
          </Box>
          <Button component={Link} href="/items/create" variant="contained" startIcon={<AddIcon />} sx={{ textTransform: "none", alignSelf: { xs: "flex-start", sm: "auto" } }}>
            Add Item
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search items"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{ input: { startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" /> } }}
            />
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

          {!loading && !error && filteredItems.length === 0 && (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">
                {items.length === 0 ? "No items found." : "No items match your search."}
              </Typography>
            </Box>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <ItemTable items={filteredItems} deletingID={deletingID} onDelete={setConfirmDeleteID} />
          )}
        </Paper>
      </Box>
      <ConfirmDialog open={confirmDeleteID !== null} title="Are you sure you want to delete this item?" onCancel={() => setConfirmDeleteID(null)} onConfirm={() => void handleDelete()} />
      <Snackbar open={Boolean(success)} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
      </Snackbar>
    </AppShell>
  );
}
