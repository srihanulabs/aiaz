import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
});

export const Products = z.array(ProductSchema);
export type Product = z.infer<typeof ProductSchema>;
