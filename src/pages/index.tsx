import { PageResult } from "@server/repositories/base/repository";
import { Grid, Container } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import { ArrayUtils } from "src/shared/utils/ArrayUtils";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "src/components/NavLink";
import { useCustomClasses } from "src/components/useCustomClasses";
import { ProductCard } from "src/components/ProductCard";

const productClient = new ProductApiClient();

type Data = {
  result: PageResult<IProduct>;
};

export const getServerSideProps: GetServerSideProps<Data> = async () => {
  const result = await productClient.getAll();

  return {
    props: { result },
  };
};

function Home({
  result,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const data = result.data;
  const products = ArrayUtils.repeat(data[0], 13);
  const classes = useCustomClasses();

  return (
    <Container>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={2}
        sx={{
          paddingTop: 2,
          justifyContent: "center",
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: "end",
          }}
        >
          <NavLink className={classes.blackBtn} href={"/add"}>
            <AddIcon />
            Add Product
          </NavLink>
        </Grid>

        {products.map((item, index) => (
          <Grid item key={index}>
            <ProductCard product={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
