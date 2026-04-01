import { FaBarcode, FaCheckCircle } from "react-icons/fa";
import { lazy, useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useAppData } from "../context/useAppData";
const TopBar = lazy(() => import("../component/TopBar"));
const Navigation = lazy(() => import("../component/Navigation"));
const Dropdown = lazy(() => import("../component/DropDown"));
import { useAlertBox } from "../component/useAlertBox";
import { printLabel } from "../api/Barcode";
import { Link } from "react-router-dom";

const PRINTER_STORAGE_KEY = "inventory_selected_printer";

const Barcode = () => {
  const barcodeRef = useRef(null);
  const { alertBox } = useAlertBox();
  const { products } = useAppData();
  const [value, setValue] = useState();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(false);
  const [name, setName] = useState(false);
  const [company, setCompany] = useState(true);
  const [no, setNo] = useState(1);

  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 5,
      });
    }
  }, [value]);

  const productOptions = products.map((product) => ({
    key: product.name,
    value: product.barcode,
  }));

  const handlePrint = async () => {
    if (!value) return;

    const selectedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY);

    const labelData = {
      code: value,
      price: product?.cost_price || "",
      name: product?.name || "",
      company: "Easy Clean",
      no: no,
      printerName: selectedPrinter || "",
    };
    const response = await printLabel(labelData);
    console.log(response);
    if (response.success) {
      alertBox("Label sent to printer successfully!", "Success", <FaCheckCircle />);
    } else {
      alertBox(response.message || "Failed to print label. Please try again.", "Error");
    }
  };
  return (
    <>
      <nav>
        <Navigation />
      </nav>

      <TopBar>
        <div className="flex items-center gap-4 py-2 text-2xl font-bold">
          <FaBarcode />
          Barcode Label
        </div>
      </TopBar>
      <main className="p-4 my-12">
        <div className="flex items-center justify-between my-4">
          <h1>Barcode Content</h1>
          <Link to="/configure" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Configure Printer
          </Link>
        </div>
        <div>
          <Dropdown
            options={productOptions}
            onChange={(e) => {
              setValue(e.value);
              const selectedProduct = products.find((p) => p.barcode === e.value);
              setProduct(selectedProduct);
            }}
            placeholder="Select a product"
          />
        </div>
        { value && (
        <div className="grid grid-cols-[3fr_2fr] gap-4 py-4 px-8 border rounded-lg shadow-md mt-4 max-w-3xl w-full place-self-center">
          <h3 className="flex items-center gap-2 col-span-2 justify-center text-2xl mb-2"><FaBarcode /> Barcode</h3>
          <form className="w-full">

            <label htmlFor="no" className="flex items-center mt-4">
              No of Copies
            </label>
            <input
              type="number"
              name="no"
              id="no"
              className="mr-2 text-sm w-full"
              value={no}
              onChange={(e) => setNo(parseInt(e.target.value) || 1)}
            />
            <div className="grid grid-cols-2">
            <label htmlFor="price" className="flex items-center mt-4">
              <input
                type="checkbox"
                name="price"
                id="price"
                className="mr-2"
                checked={price}
                onChange={(e) => setPrice(e.target.checked)}
              />
              Price
            </label>
            <label htmlFor="name" className="flex items-center mt-4">
              <input
                type="checkbox"
                name="name"
                id="name"
                className="mr-2"
                checked={name}
                onChange={(e) => setName(e.target.checked)}
              />
              Name
            </label>
            <label htmlFor="company" className="flex items-center mt-4">
              <input
                type="checkbox"
                name="company"
                id="company"
                className="mr-2"
                checked={company}
                onChange={(e) => setCompany(e.target.checked)}
              />
              Company
            </label>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-white rounded col-span-2 mt-4 w-full"
            >
              Print
            </button>
          </form>
          <div className="flex items-center justify-end">
            <div id="label" className="border border-black text-black p-4 rounded-lg flex flex-col items-center justify-center">
              {company && <span>Easy Clean</span>}
              <svg ref={barcodeRef} width="220px" height="120px" />
              <div className="flex items-center justify-evenly w-full">
                {price && <span>{"Rs. " + (product?.cost_price || "")}</span>}
                {name && <span>{product?.name || ""}</span>}
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
    </>
  );
};

export default Barcode;
