import Image, { type ImageProps } from "next/image";

/**
 * next/image for project preview screenshots, served as-is. They are already
 * compact WebP files, and re-encoding them through the optimiser can stall
 * (observed with sharp on some files), which left previews blank.
 */
const PreviewImage = (props: Omit<ImageProps, "unoptimized">) => (
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through props
  <Image {...props} unoptimized />
);

export default PreviewImage;
