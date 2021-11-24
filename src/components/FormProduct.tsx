import { Box, Button, styled, TextField } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { useForm } from "react-hook-form";

const StyledTextField = styled(TextField)({
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "& input, & textarea": {
    color: "white",
  },
  "& label" : {
      color: "rgba(255, 255, 255, 0.4)"
  },
  "& label.Mui-focused": {
    color: "rgba(255, 255, 255, 0.4)"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialValue,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StyledTextField
          label="Name"
          sx={{ margin: "10px 0" }}
          {...register("name", { required: true })}
        />

        <StyledTextField
          label="Description"
          sx={{ margin: "10px 0" }}
          multiline
          rows={4}
          {...register("description")}
        />

        <StyledTextField
          label="Image URL"
          sx={{ margin: "10px 0" }}
          {...register("imageUrl", { required: true })}
        />

        <StyledTextField
          label="Price"
          type="number"
          sx={{ margin: "10px 0" }}
          {...register("price", { required: true, min: 1 })}
        />

        <Box>
          <Button type="submit" variant="contained">
            {buttonText}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
