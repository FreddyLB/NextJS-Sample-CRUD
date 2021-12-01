import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";
import { ProductApiClient } from "src/client/api/product.client";
import { InferGetServerSidePropsType } from "next";
import { IProduct } from "@shared/models/product.model";
import { useRouter } from "next/router";
import { withAuthGetServerSideProps } from "src/auth/withAuthGetServerSideProps";
import { AxiosInterceptors } from "src/client/api/interceptors";
import { Loading } from "src/components/Loading";
import { useAuth } from "src/hooks/useAuth";
import ErrorPage from "src/pages/_error";

const productClient = new ProductApiClient();

type Data = {
  product: IProduct;
  errorCode?: number;
};

export const getServerSideProps = withAuthGetServerSideProps<Data>(
  async (context) => {
    const { id } = context.query;
    const { token } = context.req.cookies;

    if (token) {
      AxiosInterceptors.authBearerToken(productClient.client, token);
    }

    try {
      const product = await productClient.getById(String(id));
      return {
        props: {
          product,
        },
      };
    } catch (e: any) {
      return {
        props: {
          product: {} as any,
          errorCode: e.response?.status,
        },
      };
    }
  }
);

export default function EditProduct({
  product,
  errorCode,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useCustomClasses();
  const auth = useAuth();
  const router = useRouter();

  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />;
  }

  if (auth.isLoading) {
    return <Loading />;
  }

  if (auth.token) {
    AxiosInterceptors.authBearerToken(productClient.client, auth.token);
  }

  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Edit Product" />
      <NavLink
        href="/products"
        className={classes.blackBtn}
        sx={{ margin: "20px 0" }}
      >
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
