import { useRouter } from "next/router";
import React, { ComponentType, useContext, useEffect } from "react";
import { AuthContext } from "src/context/AuthContext";

export function withAuth<P = {}>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { user, isLoading } = useContext(AuthContext);

    console.log(user);

    useEffect(() => {
      if (isLoading) {
        return;
      }

      const checkAuth = async () => {
        if (user == null && router.pathname !== "/") {
          await router.replace("/");
          console.log("To login");
          return;
        }

        if (user != null && router.pathname === "/") {
          await router.replace("/products");
          console.log("To Products");
          return;
        }
      };

      checkAuth();
    }, [user, isLoading, router]);

    if (isLoading) {
      return <div style={{ color: "white" }}>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
