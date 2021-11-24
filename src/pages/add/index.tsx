import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/components/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";

export default function AddProduct() {
  const classes = useCustomClasses();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Create Product" />
      <NavLink href="/" className={classes.blackBtn} sx={{ margin: "20px 0" }}>
        <ArrowBackIcon />
        Back
      </NavLink>
      <FormProduct
        buttonText="Add Product"
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </Container>
  );
}
