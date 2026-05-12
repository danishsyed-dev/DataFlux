import { Sale, DailySales, ProductSales, PaymentStats } from '../types';

export function getDailySales(data: Sale[]): DailySales[] {
  const daily = data.reduce((acc: Record<string, DailySales>, sale) => {
    if (!acc[sale.date]) {
      acc[sale.date] = { date: sale.date, revenue: 0, orders: 0 };
    }
    acc[sale.date].revenue += sale.price;
    return acc;
  }, {});

  // For orders, we need to count unique order numbers per day
  const orderCountMap: Record<string, Set<string>> = {};
  data.forEach(sale => {
    if (!orderCountMap[sale.date]) orderCountMap[sale.date] = new Set();
    orderCountMap[sale.date].add(sale.orderNumber);
  });

  Object.keys(daily).forEach(date => {
    daily[date].orders = orderCountMap[date].size;
  });

  return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));
}

export function getProductStats(data: Sale[]): ProductSales[] {
  const products = data.reduce((acc: Record<string, ProductSales>, sale) => {
    if (!acc[sale.product]) {
      acc[sale.product] = { product: sale.product, revenue: 0, quantity: 0 };
    }
    acc[sale.product].revenue += sale.price;
    acc[sale.product].quantity += 1;
    return acc;
  }, {});

  return Object.values(products).sort((a, b) => b.revenue - a.revenue);
}

export function getPaymentStats(data: Sale[]): PaymentStats[] {
  const stats = data.reduce((acc: Record<string, PaymentStats>, sale) => {
    if (!acc[sale.paymentMethod]) {
      acc[sale.paymentMethod] = { method: sale.paymentMethod, count: 0, revenue: 0 };
    }
    acc[sale.paymentMethod].count += 1;
    acc[sale.paymentMethod].revenue += sale.price;
    return acc;
  }, {});

  return Object.values(stats);
}

export function getOverallMetrics(data: Sale[]) {
  const totalRevenue = data.reduce((sum, sale) => sum + sale.price, 0);
  const totalOrders = new Set(data.map(s => s.orderNumber)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const productStats = getProductStats(data);
  const bestSeller = productStats[0]?.product || 'N/A';

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    bestSeller,
    totalItems: data.length
  };
}

export function filterData(data: Sale[], filters: { 
  startDate?: string, 
  endDate?: string, 
  paymentMethod?: string,
  search?: string 
}) {
  return data.filter(sale => {
    const dateMatch = (!filters.startDate || sale.date >= filters.startDate) &&
                      (!filters.endDate || sale.date <= filters.endDate);
    const methodMatch = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod;
    const searchMatch = !filters.search || 
                        sale.product.toLowerCase().includes(filters.search.toLowerCase()) ||
                        sale.orderNumber.toLowerCase().includes(filters.search.toLowerCase());
    
    return dateMatch && methodMatch && searchMatch;
  });
}
