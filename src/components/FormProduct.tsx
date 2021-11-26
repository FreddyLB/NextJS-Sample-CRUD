import { Box, Paper, Button, styled, TextField, Collapse } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { useForm } from "react-hook-form";
import { useCustomClasses } from "./useCustomClasses";
import { ImageWithFallback } from "src/components/ImageWithFallback";

const StyledTextField = styled(TextField)({
  color: "white",
  "& input, & textarea": {
    color: "white",
  },
  "& label": {
    color: "rgba(255, 255, 255, 0.4)",
  },
  "& label.Mui-focused": {
    color: "rgba(255, 255, 255, 0.4)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

type FormData = {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
};

export interface FormProductProps {
  buttonText: string;
  initialValue?: IProduct;
  onSubmit: (data: FormData) => void;
}

export function FormProduct({
  buttonText,
  initialValue,
  onSubmit,
}: FormProductProps) {
  const classes = useCustomClasses();
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    initialValue?.imageUrl
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialValue,
    shouldFocusError: false,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Collapse in={!!imageUrl} collapsedSize={0}>
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
              src={imageUrl}
              alt={initialValue?.imageUrl || "New product image"}
              className={classes.imgContainer}
              layout="fill"
              objectFit="contain"
              useProxy
            />
          </Paper>
        </Collapse>
        <StyledTextField
          label="Name"
          autoComplete="off"
          sx={{ margin: "10px 0" }}
          {...register("name", { required: true, minLength: 1 })}
          error={!!errors.price}
          helperText={errors.price && "Name is required"}
        />

        <StyledTextField
          label="Description"
          autoComplete="off"
          sx={{ margin: "10px 0" }}
          multiline
          rows={4}
          {...register("description")}
        />

        <StyledTextField
          label="Image URL"
          autoComplete="off"
          sx={{ margin: "10px 0" }}
          {...register("imageUrl", { required: true, minLength: 1 })}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl && "Image URL is required"}
          onChange={(e) => {
            setImageUrl(e.target.value?.trim());
          }}
        />

        <StyledTextField
          label="Price"
          type="number"
          sx={{ margin: "10px 0" }}
          {...register("price", { required: true, min: 1 })}
          error={!!errors.price}
          helperText={
            errors.price && "Price is required and must be greater than 1"
          }
        />

        <Box>
          <Button
            type="submit"
            variant="contained"
            className={classes.blackBtn}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
