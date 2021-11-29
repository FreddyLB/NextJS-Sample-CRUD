import { Box, Paper, Typography } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { NavLink } from "./NavLink";
import { makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = makeStyles(() => ({
  "@keyframes fadeInGrow": {
    from: {
      opacity: 0,
      transform: "scale(0.5)",
    },
    to: {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  paperCard: {
    "&:hover img": {
      transform: "scale(1.1)",
    },
    opacity: 0,
    transform: "scale(0.5)",
    animation: `0.7s $fadeInGrow forwards`,
  },
  paperCardImage: {
    transition: "transform 500ms",
  },
}));

export interface ProductCardProps {
  product: IProduct;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Link href={`/products/details/${product.id}`} passHref>
      <Paper
        elevation={3}
        className={classes.paperCard}
        sx={{
          backgroundColor: "#06062c",
          overflow: "hidden",
          borderRadius: 3,
          height: 320,
          display: "flex",
          flexDirection: "column",
          animationDelay: `${(index + 1) * 100}ms !important`,
          cursor: "pointer",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <ImageWithFallback
            src={product.imageUrl!}
            alt={product.name}
            className={classes.paperCardImage}
            objectFit="cover"
            layout="fill"
            priority
          />
        </Box>

        <Box sx={{ padding: 1, marginTop: "auto" }}>
          <Typography
            sx={{
              fontSize: 25,
              paddingBottom: 2,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {product.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            {/* <NavLink
            variant="contained"
            color="info"
            href={`/products/details/${product.id}`}
          >
            Details
          </NavLink> */}
            <NavLink
              variant="outlined"
              color="primary"
              href={`/products/edit/${product.id}`}
              sx={{ width: "100%" }}
            >
              Edit
            </NavLink>
            <NavLink
              variant="outlined"
              color="error"
              href={`/products/delete/${product.id}`}
              sx={{ width: "100%" }}
            >
              Delete
            </NavLink>
          </Box>
        </Box>
      </Paper>
    </Link>
  );
}
