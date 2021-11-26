import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export function CustomAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Logo />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function Logo() {
  return (
    <Link href="/" passHref>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          cursor: "pointer",
        }}
      >
        <Typography variant="h6" color="red">
          Enough
        </Typography>
        <Typography variant="h6">Stuff</Typography>
      </Box>
    </Link>
  );
}
