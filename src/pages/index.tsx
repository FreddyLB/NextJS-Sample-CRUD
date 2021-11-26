import { PageResult } from "@server/repositories/base/repository";
import { Container, Box, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "src/components/NavLink";
import { useCustomClasses } from "src/components/useCustomClasses";
import { ProductCard } from "src/components/ProductCard";
import { makeStyles } from "@material-ui/core";

const useClasses = makeStyles(() => ({
  grid: {
    display: "grid",
    gap: 15,
    gridTemplateColumns: "repeat(auto-fit, 250px)",
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
  const products = result.data;
  const classes = useCustomClasses();
  const boxClasses = useClasses();

  return (
    <Container>
      <Box>
        <NavLink
          className={classes.blackBtn}
          href={"/products/add"}
          sx={{
            marginBottom: 2,
          }}
        >
          <AddIcon />
          Add Product
        </NavLink>
      </Box>

      {products.length === 0 && <NotProducts />}

      <Box className={boxClasses.grid}>
        {products.map((item, index) => (
          <Box key={index}>
            <ProductCard product={item} index={index} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

function NotProducts() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        userSelect: "none",
      }}
    >
      <Typography variant="h3" color="white" sx={{ fontFamily: "monospace" }}>
        No products available
      </Typography>
    </Box>
  );
}

export default Home;
