import { Box } from "@mui/material";
import React from "react";
import { CustomAppBar } from "./CustomAppBar";

export const Layout : React.FC = ({ children }) => {
  return (
    <Box sx={{ background: "#1f2267", height: "100%" }}>
      <CustomAppBar />
      { children }
    </Box>
  );
}
