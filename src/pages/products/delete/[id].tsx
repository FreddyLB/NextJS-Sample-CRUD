import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/components/useCustomClasses";
import { ProductApiClient } from "src/client/api/product.client";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { IProduct } from "@shared/models/product.model";
import { useRouter } from "next/router";
import { ProductDetails } from "src/components/ProductDetails";

const productClient = new ProductApiClient();

type Data = {
  product: IProduct;
};

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const { id } = context.query;
  const product = await productClient.getById(String(id));
  return {
    props: {
      product,
    },
  };
};

export default function DeleteProduct({
  product,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const classes = useCustomClasses();
  const router = useRouter();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Delete Details" />
      <NavLink href="/" className={classes.blackBtn} sx={{ margin: "20px 0" }}>
        <ArrowBackIcon />
        Back
      </NavLink>
      <ProductDetails product={product} />
    </Container>
  );
}
