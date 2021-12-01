import { Box, BoxProps, CircularProgress } from "@mui/material";
import React from "react";

export type LoadingProps = BoxProps & {
  loadingColor?: string;
};

export function Loading({ loadingColor, ...rest }: LoadingProps) {
  return (
    <Box
      {...rest}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        ...rest.sx,
      }}
    >
      <CircularProgress sx={{ color: loadingColor }} />
    </Box>
  );
}
