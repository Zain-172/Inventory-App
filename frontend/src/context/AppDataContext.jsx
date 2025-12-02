import { createContext, useState, useContext, useEffect } from "react";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // RAW MATERIALS
        const resMaterials = await fetch("http://localhost:5000/raw-material/");
        const materialsData = await resMaterials.json();
        const formattedMaterials = materialsData.map(item => ({
          id: item.id,
          name: item.name,
          cost_price: (Number(item.price) + Number(item.machinery) + Number(item.labour)) / Number(item.quantity),
          date_added: item.date_added,
          description: item.description
        }));
        setRawMaterials(formattedMaterials);

        // PRODUCTS
        const resProducts = await fetch("http://localhost:5000/product/");
        const productsData = await resProducts.json();
        setProducts(productsData);

        // SALES
        const resSales = await fetch("http://localhost:5000/sale/");
        const salesData = await resSales.json();

        setSales(salesData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        rawMaterials,
        setRawMaterials,
        products,
        setProducts,
        sales,
        setSales,
        loading
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook
export const useAppData = () => useContext(AppDataContext);
