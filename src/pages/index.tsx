import { Container } from "@mui/material";
import type { InferGetServerSidePropsType } from "next";
import ProductTable from "src/components/ProductTable";
import { IProduct } from "src/shared/models/product.model";

const API_URL = "http://localhost:3000/api/products";

async function getServerSideProps() {
  const res = await fetch(API_URL);
  const data = (await res.json()) as IProduct[];
  console.log("Res: " + res);

  return {
    props: {
      data,
    },
  };
}

function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(data);
  return (
    <Container style={{ padding: "60px" }}>
      <ProductTable items={data || []} />;
    </Container>
  );
}

export default Home;
