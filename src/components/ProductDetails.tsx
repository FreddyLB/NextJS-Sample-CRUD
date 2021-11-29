import {
  Box,
  Divider,
  Paper,
  Typography,
  Link as MaterialLink,
} from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useCustomClasses } from "src/hooks/useCustomClasses";
import { useAnimationsClases } from "src/hooks/useAnimations";
import { ArrayUtils } from "@shared/utils/ArrayUtils";

export interface ProductDetailsProps {
  product: IProduct;
}

const delaysMs = ArrayUtils.range(1, 10).map(i => i * 100);
const delays = delaysMs.map(ms => `${ms}ms !important`);

export function ProductDetails({ product }: ProductDetailsProps) {
  const classes = useCustomClasses();
  const animations = useAnimationsClases();

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
          className={animations.animateSlideLeftFadeIn}
          sx={{
            width: "100%",
            height: [300, 400],
            margin: "16px 0",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "black",
            animationDelay: delays[0],
          }}
        >
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className={classes.imgContainer}
            layout="fill"
            objectFit="contain"
            priority
            useProxy
          />
        </Paper>
        <Box
          className={animations.animateSlideLeftFadeIn}
          sx={{ animationDelay: delays[1] }}
        >
          <TextWithLabel label="Name" value={product.name} />
        </Box>

        <Box
          className={animations.animateSlideLeftFadeIn}
          sx={{ animationDelay: delays[2] }}
        >
          <TextWithLabel label="Description" value={product.description} />
        </Box>

        <Box
          className={animations.animateSlideLeftFadeIn}
          sx={{ animationDelay: delays[3] }}
        >
          <LinkWithLabel label="Image URL" url={product.imageUrl!} />
        </Box>

        <Box
          className={animations.animateSlideLeftFadeIn}
          sx={{ animationDelay: delays[4] }}
        >
          <TextWithLabel label="Price" value={product.price} />
        </Box>
      </Box>
    </Box>
  );
}

const TextWithLabel: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "row"],
        }}
      >
        <Typography color="red" sx={{ minWidth: 150, fontSize: 16 }}>
          {label}
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

const LinkWithLabel: React.FC<{ label: string; url: string }> = ({
  label,
  url,
}) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "row"],
        }}
      >
        <Typography color="red" sx={{ minWidth: 150, fontSize: 16 }}>
          {label}
        </Typography>
        <MaterialLink
          target="_blank"
          href={url}
          sx={{ fontSize: 16, fontFamily: "monospace" }}
        >
          {url}
        </MaterialLink>
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
