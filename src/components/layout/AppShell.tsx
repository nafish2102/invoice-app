"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Box, Button, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { getItems } from "@/services/items";

type AppShellProps = {
  title: string;
  children: React.ReactNode;
};

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "Invoices", href: "/invoices", icon: <ReceiptLongOutlinedIcon /> },
  { label: "Items", href: "/items", icon: <Inventory2OutlinedIcon /> },
];

export default function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [itemCount, setItemCount] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      document.cookie = "invoice_token=; path=/; max-age=0; SameSite=Lax";
      router.replace("/signup");
    }
  }, [router]);

  useEffect(() => {
    const loadItemCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const items = await getItems(token);
        setItemCount(items.length);
      } catch {
        setItemCount(null);
      }
    };

    void loadItemCount();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("companyID");
    document.cookie = "invoice_token=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="aside"
        sx={{
          width: { xs: 76, sm: 220 },
          flexShrink: 0,
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: "64px !important" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}>
            InvoiceApp
          </Typography>
          <ReceiptLongOutlinedIcon sx={{ display: { xs: "block", sm: "none" }, mx: "auto" }} color="primary" />
        </Toolbar>
        <List sx={{ px: { xs: 0.5, sm: 1 } }}>
          {navigationItems.map((item) => {
            const invoicesDisabled = item.href === "/invoices" && itemCount === 0;
            const menuItem = (
              <ListItemButton
                key={item.href}
                component={invoicesDisabled ? "div" : Link}
                href={invoicesDisabled ? undefined : item.href}
                selected={pathname === item.href}
                disabled={invoicesDisabled}
                onClick={(event: MouseEvent<HTMLElement>) => {
                  if (invoicesDisabled) event.preventDefault();
                }}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 0, sm: 40 }, justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ display: { xs: "none", sm: "block" } }} />
              </ListItemButton>
            );

            return invoicesDisabled ? (
              <Tooltip key={item.href} title="Please add items before creating an invoice." placement="right">
                <Box component="span" sx={{ display: "block" }}>{menuItem}</Box>
              </Tooltip>
            ) : menuItem;
          })}
        </List>
      </Box>

      <Box component="main" sx={{ minWidth: 0, flex: 1 }}>
        <Box component="header" sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Button onClick={handleLogout} startIcon={<LogoutOutlinedIcon />} sx={{ textTransform: "none" }}>
              Logout
            </Button>
          </Toolbar>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
