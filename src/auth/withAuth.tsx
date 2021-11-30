import { ComponentType } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

export function withAuth<P>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
