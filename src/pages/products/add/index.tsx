import { Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import React from "react";
import { NavLink } from "src/components/NavLink";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { FormProduct } from "src/components/FormProduct";
import { ProductApiClient } from "src/client/api/product.client";
import { useRouter } from "next/router";
import { withAuth } from "src/auth/withAuth";
import { useAnimationsClases } from "src/hooks/useAnimations";
import { AxiosInterceptors } from "src/client/api/interceptors";
import { Loading } from "src/components/Loading";
import { useAuth } from "src/hooks/useAuth";
import ErrorPage from "src/pages/_error";

const productClient = new ProductApiClient();

function AddProduct() {
  const classes = useCustomClasses();
  const animations = useAnimationsClases();
  const router = useRouter();
  const auth = useAuth();
  
  if (auth.isLoading) {
    return <Loading />;
  }

  if (auth.token) {
    AxiosInterceptors.authBearerToken(productClient.client, auth.token);
  }
  
  return (
    <Container>
      <PageTitle variant="h4" color="white" title="Create Product" />
      <NavLink href="/products" className={`${classes.blackBtn} ${animations.animateSlideLeftFadeIn}`} sx={{ margin: "20px 0" }}>
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
