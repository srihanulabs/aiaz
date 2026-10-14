"use client";
import { Product } from "@/features/product-listing/models/Product";
import { httpGet } from "@/utils/httpClient";
import React, { useEffect, useState } from "react";

export default function TableComponent() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  useEffect(() => {
    httpGet("products").then((data) => setProductsList(data.data));
  }, []);
  const handelQueryUpdate = (e: React.InputEvent) => {};
  return (
    <div className="m-2">
      <input
        type="text"
        name="filterQuery"
        id="filterQuery"
        className="border rounded-sm p-2 my-2 w-100"
        onChange={(e) => handelQueryUpdate(e)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {productsList.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
