const API_BASE_URL = 'http://localhost:5000';

export async function getDashboardData() {
    try {
        const [employeeRes, expenseRes, saleRes, ordersRes, profitRes, shopRes, attendenceRes, khataRes] = await Promise.all([
            fetch(`${API_BASE_URL}/employee/count`),
            fetch(`${API_BASE_URL}/expense/by-date`),
            fetch(`${API_BASE_URL}/sale/sale-today`),
            fetch(`${API_BASE_URL}/sale/orders-today`),
            fetch(`${API_BASE_URL}/sale/profit-today`),
            fetch(`${API_BASE_URL}/customer/count/shop`),
            fetch(`${API_BASE_URL}/attendence/count-today`),
            fetch(`${API_BASE_URL}/khata/count`)
        ]);
        if (!employeeRes.ok || !expenseRes.ok || !saleRes.ok || !ordersRes.ok || !profitRes.ok || !shopRes.ok || !attendenceRes.ok || !khataRes.ok) {
            throw new Error('Failed to fetch dashboard data');
        } else {
            const employeeData = await employeeRes.json();
            const expenseData = await expenseRes.json();
            const saleData = await saleRes.json();
            const ordersData = await ordersRes.json();
            const shopData = await shopRes.json();
            const profitData = await profitRes.json();
            const attendenceData = await attendenceRes.json();
            const khataData = await khataRes.json();
            return {
                employeeCount: employeeData.count,
                dailyExpense: expenseData.expense,
                dailySale: saleData.sale,
                dailyOrders: ordersData.orders,
                dailyProfit: profitData.profit,
                shopCount: shopData.count,
                attendance: attendenceData.count,
                khataCount: khataData.count
            };
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}