import React, { forwardRef } from "react";

const Receipt = forwardRef(({ saleData }, ref) => {
  return (
    <div ref={ref} className="p-4 bg-white text-black w-[400px]">
      <h2 className="text-xl font-bold mb-2 text-center">Sales Receipt</h2>
      <p>Date: {saleData.date}</p>
      <p>Salesman: {saleData.salesman}</p>
      <hr className="my-2" />
      <table className="w-full text-left">
        <thead>
          <tr className="text-white">
            <th className="border border-black px-2 py-1">Product</th>
            <th className="border border-black px-2 py-1">Qty</th>
            <th className="border border-black px-2 py-1">Price</th>
            <th className="border border-black px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {saleData.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-black px-2 py-1">{item.product}</td>
              <td className="border border-black px-2 py-1">{item.quantity}</td>
              <td className="border border-black px-2 py-1">{item.price}</td>
              <td className="border border-black px-2 py-1">{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="my-2" />
      <div className="flex justify-between">
      <p className="text-left font-bold">
        Total Items: {saleData.items.reduce((sum, i) => sum + Number(i.quantity), 0)}
      </p>
      <p className="text-right font-bold">
        Total Price: {saleData.items.reduce((sum, i) => sum + i.quantity * i.price, 0)}
      </p>
      </div>
    </div>
  );
});

export default Receipt;
