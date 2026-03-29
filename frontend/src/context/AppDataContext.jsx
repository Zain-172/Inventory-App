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
  const [khatas, setKhatas] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const period = [
    { value: "annually", key: "Annually" },
    { value: "monthly", key: "Monthly" },
    { value: "daily", key: "Daily" },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState(period[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const month = [
    { key: "January", value: "01" },
    { key: "February", value: "02" },
    { key: "March", value: "03" },
    { key: "April", value: "04" },
    { key: "May", value: "05" },
    { key: "June", value: "06" },
    { key: "July", value: "07" },
    { key: "August", value: "08" },
    { key: "September", value: "09" },
    { key: "October", value: "10" },
    { key: "November", value: "11" },
    { key: "December", value: "12" },
  ];

  const minimumYear = 2026;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: Math.max(currentYear - minimumYear + 1, 0) },
    (_, i) => {
      const year = currentYear - i;
      return { key: year.toString(), value: year.toString() };
    },
  );

  const [selectedMonth, setSelectedMonth] = useState(month[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

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
  const fetchKhatas = async () => {
    const resKhata = await fetch("http://localhost:5000/khata/");
    const khataData = await resKhata.json();
    setKhatas(khataData);
  };
  const fetchEmployees = async () => {
    const resEmployees = await fetch("http://localhost:5000/employee/");
    const employeesData = await resEmployees.json();
    setEmployees(employeesData);
  };
  const fetchExpenses = async () => {
    const resExpenses = await fetch("http://localhost:5000/expense/");
    const expensesData = await resExpenses.json();
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
      }`,
    );
    const salesData = await resSales.json();
    console.log("Fetched sales:", salesData);
    setSales(salesData);
  };
  const fetchProducts = async () => {
    const resProducts = await fetch("http://localhost:5000/product/");
    const productsData = await resProducts.json();
    console.log("Fetched products:", productsData);
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
      raw_id: item.raw_id,
      raw_material: item.raw_material,
      product_id: item.product_id,
      product: item.product,
      quantity: item.quantity,
      date: item.date,
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

        // KHATA
        await fetchKhatas();

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

  const fetchSalesWithItems = async (period, date) => {
    console.log(
      `Fetching sales with items for period: ${period}, date: ${date}`,
    );
    const res = await fetch(
      `http://localhost:5000/sale/with-items/${period}/${date}`,
    );
    const salesData = await res.json();
    console.log("Fetched sales with items:", salesData);
    setSalesWithItems(salesData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSalesWithItems(
          selectedPeriod.value,
          selectedPeriod.value === "daily"
            ? selectedDate
            : selectedPeriod.value === "monthly"
              ? new Date().getFullYear() +
                "-" +
                String(selectedMonth.value).padStart(2, "0")
              : selectedYear.value,
        );
      } catch (error) {
        console.error("Error fetching sales with items:", error);
      }
    };

    fetchData();
  }, [selectedPeriod, selectedDate, selectedMonth, selectedYear]);

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
        khatas,
        setKhatas,
        materials,
        setMaterials,
        loading,
        fetchCostCalculation,
        fetchEmployees,
        fetchCustomers,
        fetchKhatas,
        fetchExpenses,
        fetchMaterials,
        fetchProducts,
        fetchSales,
        fetchInventory,
        fetchSalesWithItems,
        period,
        selectedPeriod,
        setSelectedPeriod,
        selectedDate,
        setSelectedDate,
        month,
        selectedMonth,
        setSelectedMonth,
        years,
        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook
export const useAppData = () => useContext(AppDataContext);
