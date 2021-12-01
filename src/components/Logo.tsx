import { makeStyles } from "@material-ui/core";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles(() => ({
  appbar: {
    "& h6": {
      fontSize: "calc(16px + 1vw)",
      fontFamily: "monospace",
      display: "inline",
      transition: "0.3s color",
    },

    "&:hover :first-child": {
      color: "white",
    },
    "&:hover :last-child": {
      color: "red",
    },
    "& :first-child": {
      color: "red",
    },
  },
}));

export function Logo() {
  const classes = useStyles();

  return (
    <Link href="/" passHref>
      <Box className={classes.appbar}>
        <Typography variant="h6">Enough</Typography>
        <Typography variant="h6">Stuff</Typography>
      </Box>
    </Link>
  );
}
