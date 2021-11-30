import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Loading } from "src/components/Loading";
import { useAuth } from "src/hooks/useAuth";
import { LOGIN_URL, HOME_URL } from "./constants";

export const ProtectedRoute: React.FC = ({ children }) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    // const isRedirecting = (value: boolean) => {
    //   if (isMounted) {
    //     setIsRedirecting(value);
    //   }
    // }

    if (isMounted) {
      const redirect = async () => {
        if (user == null && router.pathname !== LOGIN_URL) {
          await router.replace(LOGIN_URL);
          setIsRedirecting(false);
        } else if (user != null && router.pathname === LOGIN_URL) {
          await router.replace(HOME_URL);
          setIsRedirecting(false);
        } else {
          setIsRedirecting(false);
        }
      };

      redirect();
    }

    return () => {
      isMounted = false;
    };
  }, [isLoading, isRedirecting, router, user]);

  if (isLoading || isRedirecting) {
    return <Loading />;
  }

  if (user != null) {
    return <></>;
  }

  return <>{children}</>;
};
