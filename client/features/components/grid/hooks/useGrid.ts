import { useState } from "react";

export default function useGrid() {
  const [gridData, setGridData] = useState([]);
  return { gridData };
}
