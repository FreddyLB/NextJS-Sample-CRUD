import { Box, CircularProgress } from "@mui/material";
import React from "react";

export function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
