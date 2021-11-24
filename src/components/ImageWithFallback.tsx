import Image, { ImageProps } from "next/image";
import { useRef, useState } from "react";

const NOT_FOUND_IMAGE = "/images/not-found.jpg";

export interface ImageWithFallbackProps extends ImageProps {
  fallbackImage?: string;
  alt: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackImage,
  ...rest
}: ImageWithFallbackProps) {
  fallbackImage = fallbackImage ?? NOT_FOUND_IMAGE;
  const [imageSrc, setImageSrc] = useState(src);
  const fallbackImageSet = useRef(false);

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt}
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
