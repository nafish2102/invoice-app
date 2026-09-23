"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AuthApiError, loginUser } from "@/services/auth";

const inputStyles = { "& .MuiOutlinedInput-root": { height: "30px", fontSize: "11px", borderRadius: "5px" }, "& .MuiOutlinedInput-input": { padding: "6px 9px" }, "& .MuiOutlinedInput-input::placeholder": { color: "#a7a8b8", opacity: 1 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d8d8d8" }, "& .MuiFormHelperText-root": { marginLeft: 0 } };

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(""); setPasswordError(""); setApiError("");
    let valid = true;
    if (!email.trim()) { setEmailError("Email is required."); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Please enter a valid email."); valid = false; }
    if (!password.trim()) { setPasswordError("Password is required."); valid = false; }
    if (!valid) return;
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("userID", String(response.userID));
      localStorage.setItem("companyID", String(response.companyID));
      document.cookie = `invoice_token=${encodeURIComponent(response.token)}; path=/; SameSite=Lax`;
      router.push("/dashboard");
    } catch (error) {
      setApiError(error instanceof AuthApiError ? error.message || "Could not log in. Please try again." : "Could not log in. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 16px" }}>
      <Box sx={{ width: "100%", maxWidth: "1016px", minHeight: "550px", backgroundColor: "#ffffff", border: "1px solid #cfd4da", borderRadius: "5px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ height: "54px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center" }}><Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}><ReceiptLongIcon sx={{ fontSize: 19, color: "#333333" }} /><Typography sx={{ fontSize: "14px", color: "#333333" }}>InvoiceApp</Typography></Box></Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "32px", paddingBottom: "35px" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 400, color: "#1f1f1f", marginBottom: "4px" }}>Welcome Back</Typography>
          <Typography sx={{ fontSize: "13px", color: "#666666", marginBottom: "23px" }}>Log in to your account.</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: "318px", border: "1px solid #e2e2e2", borderRadius: "6px", padding: "17px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Typography component="label" sx={{ display: "block", fontSize: "11px", color: "#444444", marginBottom: "6px" }}>Email Address*</Typography>
            <TextField fullWidth size="small" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} error={Boolean(emailError)} helperText={emailError} sx={inputStyles} />
            <Typography component="label" sx={{ display: "block", fontSize: "11px", color: "#444444", marginTop: "17px", marginBottom: "6px" }}>Password*</Typography>
            <TextField fullWidth size="small" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} error={Boolean(passwordError)} helperText={passwordError} sx={inputStyles} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton size="small" edge="end" onClick={() => setShowPassword((previous) => !previous)} sx={{ padding: "2px", color: "#999999" }}>{showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}</IconButton></InputAdornment> } }} />
            <FormControlLabel control={<Checkbox size="small" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} sx={{ padding: "5px 5px 5px 0", "& .MuiSvgIcon-root": { fontSize: 17 } }} />} label="Remember me" sx={{ margin: "7px 0", "& .MuiFormControlLabel-label": { fontSize: "11px", color: "#444444" } }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>{apiError && <Typography sx={{ alignSelf: "center", marginRight: "12px", fontSize: "10px", color: "#d32f2f" }}>{apiError}</Typography>}<Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: "63px", height: "30px", backgroundColor: "#5a5a5a", borderRadius: "5px", fontSize: "11px", fontWeight: 400, textTransform: "none", boxShadow: "none", "&:hover": { backgroundColor: "#4d4d4d", boxShadow: "none" } }}>{loading ? "Logging in..." : "Login"}</Button></Box>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "17px" }}><Button variant="text" sx={{ padding: 0, minWidth: "auto", color: "#555555", fontSize: "10px", fontWeight: 400, textTransform: "none", "&:hover": { backgroundColor: "transparent" } }}><Link href="/signup" underline="hover">Create account</Link></Button></Box>
          </Box>
        </Box>
        <Box sx={{ minHeight: "67px", borderTop: "1px solid #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}><Typography sx={{ fontSize: "10px", color: "#777777" }}>© 2025 InvoiceApp. All rights reserved.</Typography><Box sx={{ display: "flex", gap: "18px" }}><Typography sx={{ fontSize: "10px", color: "#777777" }}>Privacy Policy</Typography><Typography sx={{ fontSize: "10px", color: "#777777" }}>Terms of Service</Typography><Typography sx={{ fontSize: "10px", color: "#777777" }}>Support</Typography></Box></Box>
      </Box>
    </Box>
  );
}
