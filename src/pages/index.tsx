import { PageResult } from "@server/repositories/base/repository";
import { Grid, Container, Box } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import { ArrayUtils } from "src/shared/utils/ArrayUtils";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "src/components/NavLink";
import { useCustomClasses } from "src/components/useCustomClasses";
import { ProductCard } from "src/components/ProductCard";
import { makeStyles } from "@material-ui/core";

const useClasses = makeStyles((theme) => ({
  grid: {
    display: "grid",
    gap: 15,
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  },
}));

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
  const boxClasses = useClasses();

  return (
    <Container>
      <Box>
        <NavLink className={classes.blackBtn} href={"/products/add"} sx={{
          marginBottom: 2
        }}>
          <AddIcon />
          Add Product
        </NavLink>
      </Box>

      <Box className={boxClasses.grid}>
        {products.map((item, index) => (
          <Box key={index} >
            <ProductCard product={item} index={index} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default Home;
