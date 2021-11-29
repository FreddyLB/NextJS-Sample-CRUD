import { Box, AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "./Logo";

export function CustomAppBar() {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              cursor: "pointer",
            }}
          >
            <Logo />
          </Box>

          {!isHome && <Button color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
