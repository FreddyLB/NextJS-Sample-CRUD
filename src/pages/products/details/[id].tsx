import { Box, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { ProductApiClient } from "src/client/api/product.client";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,

} from "next";
import { IProduct } from "@shared/models/product.model";
import { ProductDetails } from "src/components/ProductDetails";
import { withAuthGetServerSideProps } from "src/auth/withAuthGetServerSideProps";

const productClient = new ProductApiClient();

type Data = {
  product: IProduct;
};

export const getServerSideProps = withAuthGetServerSideProps<Data>(async (context) => {
  const { id } = context.query;
  const product = await productClient.getById(String(id));
  return {
    props: {
      product,
    },
  };
});

export default function ViewProduct({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useCustomClasses();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Product Details" />
      <NavLink href="/products" className={classes.blackBtn} sx={{ margin: "20px 0" }}>
        <ArrowBackIcon />
        Back
      </NavLink>
      <ProductDetails product={product} />
      <Box sx={{ margin: "20px 0" }}>
        <NavLink
          href={`/products/edit/${product.id}`}
          className={classes.blackBtn}
          sx={{
            width: "100%",
          }}
        >
          Edit
        </NavLink>
      </Box>
    </Container>
  );
}