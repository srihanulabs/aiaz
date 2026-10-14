import { type Product } from "../models/Product";

interface ProductRowProps {
  product: Product;
  onSelect: (id: string) => void;
}
export default function ProductRow({ product, onSelect }: ProductRowProps) {
  console.log(`Rendering Product ${product.id}`);
  return <>Product List</>;
}
