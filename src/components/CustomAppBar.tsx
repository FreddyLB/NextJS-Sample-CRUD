import { makeStyles } from "@material-ui/core";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles(() => ({
  appbar: {
    "& h6": {
      fontSize: "1.6rem",
      fontFamily: "monospace",
      display: "inline",
      transition: "0.3s color"
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

export function CustomAppBar() {
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

          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function Logo() {
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
