
import { useState, useEffect, lazy } from 'react';
import { FaArrowRight, FaCheckCircle, FaPrint } from 'react-icons/fa';
import { getPrinters } from '../api/Barcode';
const Navigation = lazy(() => import('../component/Navigation'));
const TopBar = lazy(() => import('../component/TopBar'));
const DropDown = lazy(() => import('../component/DropDown'));

const PRINTER_STORAGE_KEY = 'inventory_selected_printer';

const Configure = () => {
    const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(() => localStorage.getItem(PRINTER_STORAGE_KEY) || '');
  const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchPrinters = async () => {
            try {
                const data = await getPrinters();
                setPrinters(data);
            } catch (error) {
                console.error("Failed to fetch printers", error);
            }
        };

        fetchPrinters();
    }, []);

    return (
    <div className="grid min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex gap-2 items-center py-2">
          <FaPrint />
          Printer Configuration
        </h1>
      </TopBar>

      <main className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className='mb-8'>
            <h1 className="text-xl font-semibold mb-2">Saved Printer</h1>
            <p className='flex items-center gap-2 bg-green-300 py-2 px-4 rounded-md'><FaCheckCircle />{selectedPrinter || 'No printer selected'}</p>
        </div>
        <div>
            <h1 className='text-xl font-semibold mb-4'>Configure Printer</h1>
            <DropDown
                label={{ key: selectedPrinter || 'Select a printer', value: selectedPrinter || '' }}
                options={printers.map((printer) => ({ key: printer, value: printer }))}
                placeholder="Select a printer"
                onChange={(option) => {
                    setSelectedPrinter(option.value);
                    setIsSaved(false);
                }}
            />

            <button
              type="button"
              onClick={() => {
                if (!selectedPrinter) return;
                localStorage.setItem(PRINTER_STORAGE_KEY, selectedPrinter);
                setIsSaved(true);
              }}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Printer
            </button>

            {isSaved && (
              <p className="mt-3 flex items-center gap-2 text-green-700">
                <FaCheckCircle />
                Saved. This printer will be used for label printing.
              </p>
            )}

        </div>
        <section className="mt-10 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-3">How to Share Printer (Windows)</h2>
          <ol className="pl-5 space-y-2 text-sm sm:text-base">
            <li className='flex items-center gap-2'>1. Open Settings <FaArrowRight /> Bluetooth & devices <FaArrowRight /> Printers & scanners.</li>
            <li className='grid grid-cols-2 gap-2'><img src="printer_1.png" alt="Settings" /><img src="printer_2.png" alt="Bluetooth & Devices" /></li>
            <li className='flex items-center gap-2'>2. Click on the printer you want to share.</li>
            <li className='grid grid-cols-2 gap-2'><img src="printer_3.png" alt="Bluetooth & Devices" /></li>
            <li className='flex items-center gap-2'>3. Open Printer properties and go to the Sharing tab.</li>
            <li className='grid grid-cols-2 gap-2'><img src="printer_4.png" alt="Printer" /><img src="printer_5.png" alt="Printer Properties" /><img src="printer_6.png" alt="Share Printer" /></li>
            <li className='flex items-center gap-2'>4. Check Share this printer and set a Share name <span className="text-blue-500">(e.g: BarcodePrinter)</span> <span className="text-xs text-red-500">(Note: The share name should be simple and avoid special characters)</span>.</li>
            <li className='grid grid-cols-2 gap-2'><img src="printer_7.png" alt="Share Printer" /></li>
            <li className='flex items-center gap-2'>5. Click Apply and OK to save the sharing settings.</li>
            <li className='grid grid-cols-2 gap-2'><img src="printer_8.png" alt="Apply" /></li>
            <li className='flex items-center gap-2'>6. Close and open the app and select the shared printer from the list.</li>
          </ol>
        </section>
      </main>
    </div>
    );
}

export default Configure;