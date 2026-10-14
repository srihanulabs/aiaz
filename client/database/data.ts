export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export const products: Product[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  category: index % 2 === 0 ? "Electronics" : "Furniture",
  price: Math.floor(Math.random() * 100000),
}));
