import { Box, Divider, Paper, Typography } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useCustomClasses } from "src/components/useCustomClasses";

export interface ProductDetailsProps {
  product: IProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const classes = useCustomClasses();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: [300, 400],
            margin: "16px 0",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "black",
          }}
        >
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className={classes.image}
            layout="fill"
            objectFit="contain"
            useProxy
          />
        </Paper>
        <TextWithLabel label="Name" value={product.name} />
        <TextWithLabel label="Description" value={product.description} />
        <TextWithLabel label="Image URL" value={product.imageUrl} />
        <TextWithLabel label="Price" value={product.price} />
      </Box>
    </Box>
  );
}

const TextWithLabel: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "row"],
        }}
      >
        <Typography color="#ff0076" sx={{ minWidth: 150, fontSize: 16 }}>
          {`${label}: `}
        </Typography>
        <Typography color="white" sx={{ fontSize: 16 }}>
          {value}
        </Typography>
      </Box>
      <Divider
        sx={{
          width: "100%",
          height: 1,
          backgroundColor: "white",
          opacity: 0.1,
          margin: "16px 0",
        }}
      />
    </Box>
  );
};
