const API_BASE_URL = 'http://localhost:5000';

export async function getDashboardData() {
    try {
        const [employeeRes, customerRes, expenseRes, saleRes, profitRes, shopRes] = await Promise.all([
            fetch(`${API_BASE_URL}/employee/count`),
            fetch(`${API_BASE_URL}/customer/count/cust`),
            fetch(`${API_BASE_URL}/expense/by-date`),
            fetch(`${API_BASE_URL}/sale/sale-today`),
            fetch(`${API_BASE_URL}/sale/profit-today`),
            fetch(`${API_BASE_URL}/customer/count/shop`)
        ]);
        if (!employeeRes.ok || !customerRes.ok || !expenseRes.ok || !saleRes.ok || !profitRes.ok || !shopRes.ok) {
            throw new Error('Failed to fetch dashboard data');
        } else {
            const employeeData = await employeeRes.json();
            const customerData = await customerRes.json();
            const expenseData = await expenseRes.json();
            const saleData = await saleRes.json();
            const shopData = await shopRes.json();
            const profitData = await profitRes.json();
            return {
                employeeCount: employeeData.count,
                customerCount: customerData.count,
                dailyExpense: expenseData.expense,
                dailySale: saleData.sale,
                dailyProfit: profitData.profit,
                shopCount: shopData.count
            };
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}