export default function Table() {
  const data = [
    { id: 1, name: "Product A", stock: 40, price: 1200 },
    { id: 2, name: "Product B", stock: 15, price: 800 },
    { id: 3, name: "Product C", stock: 0, price: 500 },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="">
            <tr>
              <th className="px-4 py-2 border text-left">ID</th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Stock</th>
              <th className="px-4 py-2 border text-left">Price</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="border">
                <td className="px-4 py-2 border ">{item.id}</td>
                <td className="px-4 py-2 border ">{item.name}</td>
                <td className="px-4 py-2 border ">{item.stock}</td>
                <td className="px-4 py-2 border ">Rs. {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
