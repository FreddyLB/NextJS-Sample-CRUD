import { Box, Paper, Typography } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { NavLink } from "./NavLink";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
  return (
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
      }}
    >
      <ImageWithFallback
        src={product.imageUrl!}
        alt={product.name}
        className={classes.paperCardImage}
        objectFit="cover"
        layout="responsive"
        width={700}
        height={500}
      />
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <NavLink
            variant="contained"
            color="info"
            href={`/products/details/${product.id}`}
          >
            Details
          </NavLink>
          <NavLink
            variant="contained"
            color="primary"
            href={`/products/edit/${product.id}`}
          >
            Edit
          </NavLink>
          <NavLink
            variant="contained"
            color="error"
            href={`/products/delete/${product.id}`}
          >
            Delete
          </NavLink>
        </Box>
      </Box>
    </Paper>
  );
}
