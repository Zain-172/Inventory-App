import { createContext, useState, useContext, useEffect } from "react";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesWithItems, setSalesWithItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
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
          quantity: item.quantity,
          price: item.price,
          machinery: item.machinery,
          labour: item.labour,
          cost_price: (Number(item.price) + Number(item.machinery) + Number(item.labour)) / Number(item.quantity),
          date_added: item.date_added,
        }));
        setRawMaterials(formattedMaterials);

        const resInventory = await fetch("http://localhost:5000/product/inventory");
        const inventoryData = await resInventory.json();
        setInventory(inventoryData);

        // PRODUCTS
        const resProducts = await fetch("http://localhost:5000/product/");
        const productsData = await resProducts.json();
        setProducts(productsData);

        // SALES
        const resSales = await fetch("http://localhost:5000/sale/");
        const salesData = await resSales.json();

        setSales(salesData);

        // EXPENSES
        const resExpenses = await fetch("http://localhost:5000/expense/");
        const expensesData = await resExpenses.json();
        console.log("Fetched expenses: ", expensesData);
        const formattedExpenses = expensesData.map(item => ({
          id: item.expense_id,
          title: item.title,
          description: item.description,
          amount: item.amount,
          date: item.expense_date
        }));
        console.log("Formatted expenses: ", formattedExpenses);
        setExpenses(formattedExpenses);

        // SALES WITH ITEMS
        const response = await fetch("http://localhost:5000/sale/with-items");
        const result = await response.json();
        setSalesWithItems(result);
        console.log("Fetched sales with items: ", result);
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
        inventory,
        setInventory,
        expenses,
        setExpenses,
        salesWithItems,
        setSalesWithItems,
        loading
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook
export const useAppData = () => useContext(AppDataContext);
