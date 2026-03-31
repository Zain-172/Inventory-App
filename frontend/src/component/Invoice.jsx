
const Invoice = ({ saleData }) => {

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
  const grandTotal = subTotal + (tax / 100) * subTotal;

  const storedUser = localStorage.getItem("inventory_user");
  const user = storedUser ? JSON.parse(storedUser) : null;


  return (
    <>
      <div
        className="relative p-4 bg-white text-black w-[584px] min-h-80 print:bg-white print:text-black print:h-full print:w-full print:absolute print:top-0 print:left-0 print:right-0 border-none print:border-none print:shadow-none"
      >
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Company Logo" className="w-24 aspect-square" />
              <h1 className="text-4xl font-bold">Easy Clean</h1>
            </div>
        </div>
        <hr className="my-2 print:bg-black" />
        <div className="grid grid-cols-3 w-full mb-4">
          <div className="px-2">
            <h2 className="font-bold py-1">Seller:</h2>
            <p>
              Easy Clean
            </p>
            <p>
              NTN: {user?.ntn || "--"}
            </p>
          </div>
          <div className="px-2">
            <h2 className="font-bold py-1">Billed to:</h2>
            <p>
              {saleData.customer}
            </p>
            <p>
              NTN: {user?.ntn || "--"}
            </p>
          </div>
          <div className="px-2">
            <h2 className="font-bold py-1">Invoice</h2>
            <p>
              {saleData.invoice_id}
            </p>
            <p>
              Date: {saleData.sale_date}
            </p>
          </div>
        </div>
        <table className="w-full text-left mb-4">
          <thead>
            <tr className="grid grid-cols-[1fr_2fr_8fr_2fr_2fr_3fr] border-none">
              <th className="bg-blue-900 text-white px-2 py-1">
                Sr.
              </th>
              <th className="bg-blue-900 text-white px-2 py-1">
                Barcode
              </th>
              <th className="bg-blue-900 text-white px-2 py-1">
                Items Description
              </th>
              <th className="bg-blue-900 text-white px-2 py-1">
                Units
              </th>
              <th className="bg-blue-900 text-white px-2 py-1">
                Price
              </th>
              <th className="bg-blue-900 text-white px-2 py-1">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {saleData.items.map((item, idx) => (
              <tr key={idx} className="grid grid-cols-[1fr_2fr_8fr_2fr_2fr_3fr] border-b border-black">
                <td className="text-black px-2 py-1">
                  {idx + 1}
                </td>
                <td className="text-black px-2 py-1">
                  {item.barcode}
                </td>
                <td className="text-black px-2 py-1">
                  {item.product_name}
                </td>
                <td className="text-black px-2 py-1">
                  {item.quantity}
                </td>
                <td className="text-black px-2 py-1">
                  {item.price}
                </td>
                <td className="text-black px-2 py-1">
                  {item.quantity * item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2 gap-6">
            <p className="text-left font-bold">Total Items:</p>
            <p>
              {saleData.items.reduce((sum, i) => sum + Number(i.quantity), 0)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="text-right font-bold">Sub Total:</p>
            <p>Rs. {subTotal.toFixed(2)}</p>
          </div>
          <div></div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-bold text-right">Tax:</p>
            <p>{tax.toFixed(2)} %</p>
          </div>
          <div></div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-bold text-right">Grand Total:</p>
            <p>Rs. {grandTotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center justify-end font-bold gap-4 print:absolute print:bottom-4 print:right-0 border-t border-black pt-2 mt-2">
          <img src="/logo.png" alt="Company Logo" className="w-16 aspect-square" />
          <p className="text-xs">
            Near Shalimar Bagh, G.T. Road, Lahore <br />
            Cell No: 03097175360, 03010500010 <br />
            Email: info@easyclean.com
          </p>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="bg-green-600 text-white rounded-lg py-1 font-bold grid place-self-center w-[550px] mt-6 no-print"
      >
        Print
      </button>
    </>
  );
};

export default Invoice;
