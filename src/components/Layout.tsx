import { Box } from "@mui/material";
import React from "react";
import { CustomAppBar } from "./CustomAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box sx={{ height: "100%" }}>
      <CustomAppBar />
      <Box sx={{ padding: 2 }}>{children}</Box>
    </Box>
  );
};
