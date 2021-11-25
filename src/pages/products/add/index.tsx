import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/components/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";
import { ProductApiClient } from "src/client/api/product.client";
import { useRouter } from "next/router";

const productClient = new ProductApiClient();

export default function AddProduct() {
  const classes = useCustomClasses();
  const router = useRouter();

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
          router.push("/");
        }}
      />
    </Container>
  );
}
