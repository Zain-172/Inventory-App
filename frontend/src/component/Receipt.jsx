import { forwardRef } from "react";

const Receipt = forwardRef(({ saleData }, ref) => {
  const handleClick = () => {
    window.print();
  };
  if (!saleData) {
    return null;
  }

  const subTotal = saleData.items.reduce(
    (sum, i) => sum + Number(i.quantity) * Number(i.price),
    0,
  );
  const tax = Number(saleData.tax || 0);
  const grandTotal = subTotal + tax/100 * subTotal;

  return (
    <>
    <div ref={ref} className="relative p-4 bg-white text-black w-[550px] min-h-80 print:bg-white print:text-black print:h-full print:w-full print:absolute print:top-0 print:left-0 print:right-0">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div>
          <img src="/logo.png" alt="Company Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-center">Sales Receipt</h2>
      </div>
      <div className="grid grid-cols-2 justify-between w-full">
        <p><strong>Invoice:</strong> {saleData.invoice_id}</p>
        <p className="text-right"><strong>Salesman:</strong> {saleData.salesman}</p>
        <p><strong>Customer:</strong> {saleData.customer}</p>
        <p className="text-right"><strong>Date:</strong> {saleData.sale_date}</p>
        <p><strong>Payment:</strong> {String(saleData.status || "").replace("_", " ")}</p>
        <p className="text-right"><strong>Delivery:</strong> {String(saleData.delivery_status || "not_delivered").replace("_", " ")}</p>
      </div>
      <hr className="my-2 print:bg-black" />
      <table className="w-full text-left">
        <thead>
          <tr className="grid grid-cols-[1fr_8fr_2fr_2fr_3fr]">
            <th className="border border-black bg-white text-black px-2 py-1">Sr.</th>
            <th className="border border-black bg-white text-black px-2 py-1">Items Description</th>
            <th className="border border-black bg-white text-black px-2 py-1">Units</th>
            <th className="border border-black bg-white text-black px-2 py-1">Price</th>
            <th className="border border-black bg-white text-black px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {saleData.items.map((item, idx) => (
            <tr key={idx} className="grid grid-cols-[1fr_8fr_2fr_2fr_3fr]">
              <td className="border border-black text-black px-2 py-1">{idx + 1}</td>
              <td className="border border-black text-black px-2 py-1">{item.product_name}</td>
              <td className="border border-black text-black px-2 py-1">{item.quantity}</td>
              <td className="border border-black text-black px-2 py-1">{item.price}</td>
              <td className="border border-black text-black px-2 py-1">{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="my-2 print:bg-black bg-black" />
      <div className="grid grid-cols-4">
          <p className="text-left font-bold">
            Total Items: 
          </p>
          <p>
            {saleData.items.reduce((sum, i) => sum + Number(i.quantity), 0)}
          </p>
          <p className="text-right font-bold">
            Sub Total: 
          </p>
            <p className="font-bold text-right">{subTotal.toFixed(2)}</p>
        <p className="font-bold col-span-3 text-right">Tax:</p>
        <p className="font-bold text-right">{tax.toFixed(2)} %</p>

        <p className="font-bold col-span-3 text-right">Grand Total:</p>
        <p className="font-bold text-right">{grandTotal.toFixed(2)}</p>
      </div>
    </div>
    <button onClick={handleClick} className="bg-blue-900 rounded-lg py-1 font-bold grid place-self-center w-[550px] mt-6 no-print">Print</button>
    </>
  );
});

export default Receipt;
