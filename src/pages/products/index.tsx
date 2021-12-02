import {
  EMPTY_PAGE_RESULT,
  PageResult,
} from "@server/repositories/base/repository";
import { Container, Box, Typography } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { IProduct } from "src/shared/models/product.model";
import { ProductApiClient } from "src/client/api/product.client";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "src/components/NavLink";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { ProductCard } from "src/components/ProductCard";
import { makeStyles } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { SearchTextField } from "src/components/SearchTextField";
import { useDebounce } from "src/hooks/useDebounce";
import { withAuthGetServerSideProps } from "src/auth/withAuthGetServerSideProps";
import ErrorPage from "../_error";
import { AxiosInterceptors } from "src/client/api/interceptors";
import { useAuth } from "src/hooks/useAuth";
import { Loading } from "src/components/Loading";
import { isBrowser } from "@shared/utils";

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
  errorCode?: number;
};

export const getServerSideProps = withAuthGetServerSideProps<Data>(
  async (context) => {
    try {
      const { token } = context.req.cookies;

      if (token) {
        AxiosInterceptors.authBearerToken(productClient.client, token);
      }

      const result = await productClient.getAll();

      return { props: { result } };
    } catch (e: any) {
      return {
        props: {
          result: EMPTY_PAGE_RESULT,
          errorCode: e.response?.status,
        },
      };
    }
  }
);

function ListProducts({
  result,
  errorCode,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [products, setProducts] = useState<IProduct[]>(result.data);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const auth = useAuth();
  const isFirstRender = useRef(true);
  const classes = useCustomClasses();
  const boxClasses = useClasses();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />;
  }

  if (mounted && auth.isLoading) {
    return <Loading />;
  }

  if (auth.token) {
    AxiosInterceptors.authBearerToken(productClient.client, auth.token);
  }

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
      <Typography
        variant="h4"
        color="white"
        sx={{ fontFamily: "monospace", opacity: 0.3 }}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default ListProducts;
