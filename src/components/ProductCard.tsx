import { Box, Paper, Typography } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { NavLink } from "./NavLink";

export function ProductCard({ product }: { product: IProduct }) {
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
          <NavLink variant="contained" color="info"  href={`/details/${product.id}`}>
            Details
          </NavLink>
          <NavLink variant="contained" color="primary" href={`/edit/${product.id}`}>
            Edit
          </NavLink>
          <NavLink variant="contained" color="error"  href={`/delete/${product.id}`}>
            Delete
          </NavLink>
        </Box>
      </Box>
    </Paper>
  );
}
