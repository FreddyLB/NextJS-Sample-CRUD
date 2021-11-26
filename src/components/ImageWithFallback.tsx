import Image, { ImageLoader, ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { API_URL } from "src/client/contants";

const NOT_FOUND_IMAGE = "/images/not-found.jpg";
const IMAGE_PROXY_URL = API_URL + "/imageproxy?url=";

export interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string;
  fallbackImage?: string;
  alt: string;
  useProxy?: boolean;
}

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export function ImageWithFallback({
  src,
  alt,
  fallbackImage,
  useProxy,
  ...rest
}: ImageWithFallbackProps) {
  fallbackImage ??= NOT_FOUND_IMAGE;
  src ??= fallbackImage;

  if (useProxy === true && src != fallbackImage) {
    src = IMAGE_PROXY_URL + encodeURIComponent(src);
  }

  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (src && src != imageSrc) {
      setImageSrc(src);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt}
      loader={imageLoader}
      onError={() => {
        // Check if the fallback image is not already set
        console.error("Image not found");
        if (imageSrc != fallbackImage) {
          setImageSrc(fallbackImage!);
        }
      }}
    />
  );
}
