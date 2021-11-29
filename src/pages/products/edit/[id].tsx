import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";
import { ProductApiClient } from "src/client/api/product.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "@shared/models/product.model";
import { useRouter } from "next/router";

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

export default function EditProduct({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useCustomClasses();
  const router = useRouter();

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Edit Product" />
      <NavLink href="/products" className={classes.blackBtn} sx={{ margin: "20px 0" }}>
        <ArrowBackIcon />
        Back
      </NavLink>
      <FormProduct
        buttonText="Save Product"
        initialValue={product}
        onSubmit={async (data) => {
          try {
            await productClient.update(product.id, data);
            router.push("/products");
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </Container>
  );
}
