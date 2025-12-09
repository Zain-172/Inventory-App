import { forwardRef } from "react";

const Receipt = forwardRef(({ saleData }, ref) => {
  const handleClick = () => {
    window.print();
  };
  return (
    <>
    <div ref={ref} className="relative p-4 bg-white text-black w-[550px] min-h-80 print:bg-white print:text-black print:h-full print:w-full print:absolute print:top-0 print:left-0 print:right-0">
      <h2 className="text-xl font-bold mb-2 text-center">Sales Receipt</h2>
      <div className="grid grid-cols-2 justify-between w-full">
        <p><strong>Invoice:</strong> {saleData.invoice_id}</p>
        <p className="text-right"><strong>Salesman:</strong> {saleData.salesman}</p>
        <p><strong>Customer:</strong> {saleData.customer}</p>
        <p className="text-right"><strong>Shop:</strong> {saleData.shop}</p>
      </div>
      <hr className="my-2 print:bg-black" />
      <table className="w-full text-left">
        <thead>
          <tr className="">
            <th className="border border-black bg-white px-2 py-1">Product</th>
            <th className="border border-black bg-white px-2 py-1">Quantity</th>
            <th className="border border-black bg-white px-2 py-1">Price</th>
            <th className="border border-black bg-white px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {saleData.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-black px-2 py-1">{item.product_name}</td>
              <td className="border border-black px-2 py-1">{item.quantity}</td>
              <td className="border border-black px-2 py-1">{item.price}</td>
              <td className="border border-black px-2 py-1">{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="my-2 print:bg-black" />
      <div className="flex justify-between">
      <p className="text-left font-bold">
        Total Items: {saleData.items.reduce((sum, i) => sum + Number(i.quantity), 0)}
      </p>
      <p className="text-right font-bold">
        Total Price: {saleData.items.reduce((sum, i) => sum + i.quantity * i.price, 0)}
      </p>
      </div>
      <p className="absolute bottom-1 right-2 text-sm text-gray-600">{saleData.sale_date}</p>
    </div>
    <button onClick={handleClick} className="bg-blue-900 rounded-sm py-1 font-bold grid place-self-center w-[550px] mt-6 no-print">Print</button>
    </>
  );
});

export default Receipt;
