import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { FirebaseUser } from "src/context/AuthContext";
import { useAuth } from "src/hooks/useAuth";
import { Logo } from "./Logo";

export function CustomAppBar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const isHome = router.pathname === "/";
  const showAuthButton = !isLoading && router.isReady && !isHome;

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

          {!isLoading && user && <AppbarUserDetails user={user} />}
          {showAuthButton && user != null && (
            <AppbarButton
              text="Logout"
              onClick={() => {
                logout();
                router.replace("/");
              }}
            />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function AppbarButton(props: { text: string; onClick: () => void }) {
  return (
    <Button
      color="inherit"
      onClick={props.onClick}
      sx={{ fontFamily: "monospace", fontSize: "calc(6px + 1vw)" }}
    >
      {props.text}
    </Button>
  );
}

function AppbarUserDetails(props: { user: FirebaseUser }) {
  const { user } = props;

  return (
    <Typography
      variant="h6"
      sx={{
        color: "red",
        fontFamily: "monospace",
        fontSize: "calc(8px + 1vw)",
      }}
    >
      {user.displayName} -
    </Typography>
  );
}
