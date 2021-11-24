import Image, { ImageLoader, ImageProps } from "next/image";
import { useRef, useState } from "react";
import { API_URL } from "src/client/contants";

const NOT_FOUND_IMAGE = "/images/not-found.jpg";
const IMAGE_PROXY_URL = API_URL + "/imageproxy?url=";

export interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string;
  fallbackImage?: string;
  alt: string;
  useProxy?: boolean; 
}

const imageLoader : ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export function ImageWithFallback({
  src,
  alt,
  fallbackImage,
  useProxy,
  ...rest
}: ImageWithFallbackProps) {
  fallbackImage = fallbackImage ?? NOT_FOUND_IMAGE;
  const actualSrc = src || fallbackImage;

  if (useProxy === true && src != null) {
    src = IMAGE_PROXY_URL + encodeURIComponent(src);
  }

  const [imageSrc, setImageSrc] = useState(actualSrc);
  const fallbackImageSet = useRef(false);

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt}
      loader={imageLoader}
      onError={() => {
        // To prevent a loop if the fallback image is not found
        if (fallbackImageSet.current === false) {
          setImageSrc(fallbackImage!);
          fallbackImageSet.current = true;
        }
      }}
    />
  );
}
