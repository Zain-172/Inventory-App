export const fetchProductHistory = () => {
  return fetch("http://localhost:5000/product/history").then((res) => {
    if (!res.ok) throw new Error("Failed to fetch product history");
    return res.json();
  });
};

export const deleteProductHistory = (id) => {
  return fetch(`http://localhost:5000/product/history/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete history entry");
    return res.json();
  });
};
