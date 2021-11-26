import { Container, Box, Button } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/components/useCustomClasses";
import { ProductApiClient } from "src/client/api/product.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      <Box sx={{ margin: "20px 0" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          color="error"
          onClick={async () => {
            try {
              await productClient.delete(product.id);
              router.push("/");
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Delete
        </Button>
      </Box>
    </Container>
  );
}
