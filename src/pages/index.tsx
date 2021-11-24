import { PageResult } from "@server/repositories/base/repository";
import {
  Box,
  Grid,
  Container,
  Typography,
  IconButton,
  Button,
  Toolbar,
} from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrayUtils } from "src/shared/utils/ArrayUtils";
import Image from "next/image";

const productClient = new ProductApiClient();

const PINNAPLE: IProduct = {
  id: "1",
  name: "Pinnaple",
  description:
    "A pinnaple is a small, round fruit with a hard, fibrous, brownish-black pulp. The pulp is usually edible, but the pinnaple is also used as a food additive.",
  price: 1.99,
  imageUrl:
    "https://www.thelist.com/img/gallery/when-you-eat-pineapple-every-day-this-is-what-happens/intro-1619201888.webp",
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
    <Box sx={{ background: "#1f2267", height: "100vh" }}>
      <ButtonAppBar />
      <Container
        sx={{
          padding: 10,
        }}
      >
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
    </Box>
  );
}

function ProductCard({ product }: { product: IProduct }) {
  const NOT_FOUND_URL =
    "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";

  return (
    <Box sx={{ overflow: "hidden", borderRadius: 4 }}>
      <Image
        src={product.imageUrl || NOT_FOUND_URL}
        alt={product.name}
        objectFit="cover"
        width={200}
        height={300}
      />
    </Box>
  );
}

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CRUD
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Home;
