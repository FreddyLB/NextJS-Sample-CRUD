import { PageResult } from "@lib/repositories/base/repository";
import { Container, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ProductTable from "src/components/ProductTable";
import { IProduct } from "src/shared/models/product.model";

const API_URL = "http://localhost:3000/api/products";

type Data = {
  data: PageResult<IProduct>;
};

export const getServerSideProps: GetServerSideProps<Data> = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();

  return {
    props: { data },
  };
};

function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const result = data.data;

  return (
    <Container style={{ padding: "60px 20px" }}>
      <Typography
        variant="h1"
        sx={{ fontFamily: "monospace", fontSize: 30, marginBottom: 2 }}
      >
        Products
      </Typography>
      <ProductTable items={result} />
    </Container>
  );
}

export default Home;
