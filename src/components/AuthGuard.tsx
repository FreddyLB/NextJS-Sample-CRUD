import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useAuth } from "src/hooks/useAuth";

export const AuthGuard: React.FC = ({ children }) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const redirect = async () => {
      if (user == null && router.pathname !== "/") {
        await router.replace("/");
        setIsRedirecting(false);
      } else if (user != null && router.pathname === "/") {
        await router.replace("/products");
        setIsRedirecting(false);
      } else {
        setIsRedirecting(false);
      }
    };

    redirect();
  }, [isLoading, isRedirecting, router, user]);

  if (isLoading || isRedirecting) {
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

  return <>{children}</>;
};
