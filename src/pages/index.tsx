import { PageResult } from "@server/repositories/base/repository";
import { Box, Grid, Container, Button, Paper, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import { ArrayUtils } from "src/shared/utils/ArrayUtils";
import Image from "next/image";
import React from "react";
import { ImageWithFallback } from "src/components/ImageWithFallback";

const productClient = new ProductApiClient();

const PINNAPLE: IProduct = {
  id: "1",
  name: "Pinnaple",
  description:
    "A pinnaple is a small, round fruit with a hard, fibrous, brownish-black pulp. The pulp is usually edible, but the pinnaple is also used as a food additive.",
  price: 1.99,
  imageUrl:
    "https://cdn.mos.cms.futurecdn.net/JEKZM22ZasnFC7JFGkAMvU-1024-80.jpg.webp",
  color: "yellow",
  createdAt: new Date(),
  updatedAt: new Date(),
};

type Data = {
  data: PageResult<IProduct>;
};

export const getServerSideProps: GetServerSideProps<Data> = async () => {
  const data = await productClient.getAll();

  return {
    props: { data },
  };
};

function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const result = data.data;
  const products = ArrayUtils.repeat(PINNAPLE, 24);

  return (
    <Container>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          justifyContent: "center",
        }}
      >
        {products.map((item, index) => (
          <Grid
            item
            key={index}
            sx={{
              margin: 2,
            }}
          >
            <ProductCard product={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function ProductCard({ product }: { product: IProduct }) {
  return (
    <Paper
      elevation={3}
      sx={{ backgroundColor: "white", overflow: "hidden", borderRadius: 3 }}
    >
      <ImageWithFallback
        src={product.imageUrl!}
        alt={product.name}
        objectFit="cover"
        width={300}
        height={250}
      />
      <Box sx={{ padding: 1 }}>
        <Typography
          sx={{
            fontSize: 25,
            paddingBottom: 2,
            fontWeight: "bold",
            color: "black",
          }}
        >
          {product.name}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button variant="contained" color="info">
            Details
          </Button>
          <Button variant="contained" color="primary">
            Edit
          </Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default Home;
