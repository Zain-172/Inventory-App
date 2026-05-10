import { BASE_URL } from "../config";

export const fetchProductHistory = (signal) => {
  return fetch(`${BASE_URL}/product/history`, { signal }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch product history");
    return res.json();
  });
};

export const deleteProductHistory = (id, signal) => {
  return fetch(`${BASE_URL}/product/history/${id}`, {
    method: "DELETE",
    signal,
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete history entry");
    return res.json();
  });
};
