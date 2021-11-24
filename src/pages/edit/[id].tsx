import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/components/useCustomClasses";

export default function EditProduct() {
  const classes = useCustomClasses();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Edit Product" />
      <NavLink href="/" className={classes.blackBtn} sx={{margin: "20px 0"}}>
        <ArrowBackIcon />
        Back
      </NavLink>
    </Container>
  );
}
