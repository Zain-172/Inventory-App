import { createContext, useState, useContext, useEffect } from "react";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesWithItems, setSalesWithItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [from, setFrom] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]);

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
        const resSales = await fetch(`http://localhost:5000/sale/?date=${new Date().toISOString().split("T")[0]}`);
        const salesData = await resSales.json();

        setSales(salesData);

        // EXPENSES
        const resExpenses = await fetch("http://localhost:5000/expense/");
        const expensesData = await resExpenses.json();
        console.log("Fetched expenses:", expensesData);
        const formattedExpenses = expensesData.map(item => ({
          id: item.id,
          title: item.title,
          amount: item.amount,
          date: item.date,
          description: item.description ? item.description : "",
        }));
        setExpenses(formattedExpenses);

        const resEmployees = await fetch("http://localhost:5000/employee/");
        const employeesData = await resEmployees.json();
        setEmployees(employeesData);

        const resCustomers = await fetch("http://localhost:5000/customer/");
        const customersData = await resCustomers.json();
        setCustomers(customersData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchSalesWithItems = async (to, from) => {
      try {
        const res = await fetch(`http://localhost:5000/sale/with-items?to=${to}&from=${from}`);
        const data = await res.json();
        console.log("Fetched sales with items:", data);
        setSalesWithItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSalesWithItems(to, from);
  }, [to, from]);

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
        employees,
        setEmployees,
        customers,
        setCustomers,
        loading,
        to,
        setTo,
        from,
        setFrom
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook
export const useAppData = () => useContext(AppDataContext);
