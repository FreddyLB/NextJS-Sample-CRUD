import React from "react";
import { Box, Typography, TypographyProps } from "@mui/material";

export interface PageTitleProps extends TypographyProps {
  title: string;
  center?: boolean;
}

export function PageTitle({ title, center, ...rest }: PageTitleProps) {
  let Title = <Typography {...rest}>{title}</Typography>;

  if (center === true) {
    Title = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {Title}
      </Box>
    );
  }

  return Title;
}
