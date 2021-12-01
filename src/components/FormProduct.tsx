import { Box, Paper, Button, styled, TextField, Collapse } from "@mui/material";
import { IProduct } from "@shared/models/product.model";
import React from "react";
import { useForm, Validate } from "react-hook-form";
import { useCustomClasses } from "../hooks/useCustomClasses";
import { ImageWithFallback } from "src/components/ImageWithFallback";
import { checkIsImage } from "@shared/utils/checkIsImage";
import { useAnimationsClases } from "src/hooks/useAnimations";
import { ArrayUtils } from "@shared/utils/ArrayUtils";

const delaysMs = ArrayUtils.range(1, 6).map((i) => i * 100);
const delays = delaysMs.map((ms) => `${ms}ms !important`);

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
  const animations = useAnimationsClases();
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
          className={animations.animateSlideLeftFadeIn}
          sx={{ margin: "10px 0", animationDelay: delays[1] }}
          {...register("name", { required: true, minLength: 1 })}
          error={!!errors.price}
          helperText={errors.price && "Name is required"}
        />

        <StyledTextField
          label="Description"
          autoComplete="off"
          className={animations.animateSlideLeftFadeIn}
          sx={{ margin: "10px 0", animationDelay: delays[2] }}
          multiline
          rows={4}
          {...register("description")}
        />

        <StyledTextField
          label="Image URL"
          autoComplete="off"
          className={animations.animateSlideLeftFadeIn}
          sx={{ margin: "10px 0", animationDelay: delays[3] }}
          {...register("imageUrl", { validate: validateImageUrl })}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl?.message}
          onChange={(e) => {
            setImageUrl(e.target.value?.trim());
          }}
        />

        <StyledTextField
          label="Price"
          type="number"
          className={animations.animateSlideLeftFadeIn}
          sx={{ margin: "10px 0", animationDelay: delays[4] }}
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
            sx={{ animationDelay: delays[5] }}
            className={`${classes.blackBtn} ${animations.animateSlideLeftFadeIn}`}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </form>
  );
}

const validateImageUrl: Validate<string | undefined> = async (url) => {
  if (url == null || url.trim().length === 0) {
    return "Image URL is required";
  }

  try {
    const isImage = await checkIsImage(url);

    if (!isImage) {
      return "Invalid image URL";
    }
  } catch (e) {
    console.error(e);

    // Fallback in case CORS block the request for HEAD
    if (!isValidImageURL(url)) {
      return "Invalid image URL";
    }
  }

  return true;
};

function isValidImageURL(url: string) {
  const imageExtensions = [
    ".jpg",
    ".png",
    ".jpeg",
    ".bmp",
    ".webp",
    ".svg",
    ".tiff",
    ".tif",
    ".gif",
    ".ico",
  ];
  return imageExtensions.some((ext) => url.endsWith(ext));
}
