import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";
import { ProductApiClient } from "src/client/api/product.client";
import { useRouter } from "next/router";
import { withAuthGetServerSideProps } from "src/auth/withAuthGetServerSideProps";
import { withAuth } from "src/auth/withAuth";

const productClient = new ProductApiClient();

function AddProduct() {
  const classes = useCustomClasses();
  const router = useRouter();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Create Product" />
      <NavLink href="/products" className={classes.blackBtn} sx={{ margin: "20px 0" }}>
        <ArrowBackIcon />
        Back
      </NavLink>
      <FormProduct
        buttonText="Add Product"
        onSubmit={async (data) => {
          try {
            await productClient.create(data);
            router.push("/products");
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </Container>
  );
}

export default withAuth(AddProduct);
