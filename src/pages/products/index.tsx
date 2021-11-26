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
import { useEffect, useRef, useState } from "react";
import React from "react";
import { SearchTextField } from "src/components/SearchTextField";
import { useDebounce } from "src/hooks/useDebounce";

const useClasses = makeStyles(() => ({
  grid: {
    display: "grid",
    gap: 15,
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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

function ListProducts({
  result,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [products, setProducts] = useState<IProduct[]>(result.data);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const isFirstRender = useRef(true);
  const classes = useCustomClasses();
  const boxClasses = useClasses();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const result = productClient.search({
      search: debouncedSearch,
    });

    result.then((res) => setProducts(res.data));
  }, [debouncedSearch]);

  const CenterText = function CenterText() {
    if (result.data.length === 0) {
      return <PageCenterText text="No products available" />;
    }

    if (products.length === 0) {
      return <PageCenterText text="No products found" />;
    }

    return <></>;
  };

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
      {result.data.length > 0 && (
        <Box
          sx={{
            width: "100%",
            margin: "10px 0",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <SearchTextField
            fullWidth
            value={search}
            variant="outlined"
            color="info"
            sx={{ color: "white" }}
            onSearch={(term) => {
              console.log(term);
              setSearch(term);
            }}
          />
        </Box>
      )}
      <CenterText />

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

interface PageCenterTextFProps {
  text: string;
}

function PageCenterText({ text }: PageCenterTextFProps) {
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
        {text}
      </Typography>
    </Box>
  );
}

export default ListProducts;
