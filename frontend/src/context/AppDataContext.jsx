import { createContext, useState, useContext, useEffect } from "react";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesWithItems, setSalesWithItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [from, setFrom] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );

  const fetchMaterials = async () => {
    const resRaw = await fetch("http://localhost:5000/material/");
    const rawData = await resRaw.json();
    setMaterials(rawData);
  };

  const fetchCustomers = async () => {
    const resCustomers = await fetch("http://localhost:5000/customer/");
    const customersData = await resCustomers.json();
    setCustomers(customersData);
  };
  const fetchEmployees = async () => {
    const resEmployees = await fetch("http://localhost:5000/employee/");
    const employeesData = await resEmployees.json();
    setEmployees(employeesData);
  };
  const fetchExpenses = async () => {
    const resExpenses = await fetch("http://localhost:5000/expense/");
    const expensesData = await resExpenses.json();
    console.log("Fetched expenses:", expensesData);
    const formattedExpenses = expensesData.map((item) => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      date: item.date,
      description: item.description ? item.description : "",
    }));
    setExpenses(formattedExpenses);
  };
  const fetchSales = async () => {
    const resSales = await fetch(
      `http://localhost:5000/sale/?date=${
        new Date().toISOString().split("T")[0]
      }`
    );
    const salesData = await resSales.json();
    setSales(salesData);
  };
  const fetchProducts = async () => {
    const resProducts = await fetch("http://localhost:5000/product/");
    const productsData = await resProducts.json();
    setProducts(productsData);
  };
  const fetchInventory = async () => {
    const resInventory = await fetch("http://localhost:5000/product/inventory");
    const inventoryData = await resInventory.json();
    setInventory(inventoryData);
  };
  const fetchCostCalculation = async () => {
    const resMaterials = await fetch("http://localhost:5000/raw-material/");
    const materialsData = await resMaterials.json();
    const formattedMaterials = materialsData.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      machinery: item.machinery,
      labour: item.labour,
      cost_price:
        (Number(item.price) + Number(item.machinery) + Number(item.labour)) /
        Number(item.quantity),
      date_added: item.date_added,
    }));
    setRawMaterials(formattedMaterials);
  };
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // RAW MATERIALS
        await fetchCostCalculation();

        // INVENTORY
        await fetchInventory();

        // PRODUCTS
        await fetchProducts();

        // SALES
        await fetchSales();

        // EXPENSES
        await fetchExpenses();

        // EMPLOYEES
        await fetchEmployees();

        // CUSTOMERS
        await fetchCustomers();

        // MATERIALS
        await fetchMaterials();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  
  const fetchSalesWithItems = async (to, from) => {
    try {
      const res = await fetch(
        `http://localhost:5000/sale/with-items?to=${to}&from=${from}`
      );
      const data = await res.json();
      console.log("Fetched sales with items:", data);
      setSalesWithItems(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
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
        materials,
        setMaterials,
        loading,
        to,
        setTo,
        from,
        setFrom,
        fetchCostCalculation,
        fetchEmployees,
        fetchCustomers,
        fetchExpenses,
        fetchMaterials,
        fetchProducts,
        fetchSales,
        fetchInventory,
        fetchSalesWithItems,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook
export const useAppData = () => useContext(AppDataContext);
