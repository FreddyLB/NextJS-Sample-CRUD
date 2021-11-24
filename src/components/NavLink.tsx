import React from "react";
import Link from "next/link";
import {
  Button,
  ButtonProps,
} from "@mui/material";

export type NavLinkProps = ButtonProps & {
  href: string;
};

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  className,
  ...rest
}) => {
  return (
    <Link href={href} passHref>
      <Button variant="contained" {...rest} className={className}>
        {children}
      </Button>
    </Link>
  );
};
