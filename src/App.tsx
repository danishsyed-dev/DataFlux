/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingCart, DollarSign, TrendingUp, Search, 
  Calendar, CreditCard, ArrowUpRight, Package, Filter, Download,
  ExternalLink, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SALES_DATA } from './data';
import { 
  getDailySales, getProductStats, getPaymentStats, 
  getOverallMetrics, filterData 
} from './utils/data-processing';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function App() {
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Process data based on filters
  const filteredSales = useMemo(() => {
    return filterData(SALES_DATA, {
      search,
      paymentMethod: paymentMethod === 'All' ? '' : paymentMethod,
      startDate: dateRange.start,
      endDate: dateRange.end
    });
  }, [search, paymentMethod, dateRange]);

  const metrics = useMemo(() => getOverallMetrics(filteredSales), [filteredSales]);
  const dailyData = useMemo(() => getDailySales(filteredSales), [filteredSales]);
  const productData = useMemo(() => getProductStats(filteredSales).slice(0, 5), [filteredSales]);
  const paymentData = useMemo(() => getPaymentStats(filteredSales), [filteredSales]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 flex flex-col font-sans">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-1.5 rounded flex items-center justify-center text-black font-bold">
              Δ
            </div>
            <h1 className="text-lg font-semibold text-white tracking-tight">DATAFLUX</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live System
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-emerald-500/10">
              DA
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium text-white tracking-tight">Q4 Performance <span className="text-gray-500 text-sm ml-2 font-normal">Real-time Data</span></h2>
            <p className="text-gray-500 text-sm mt-1">Executive summary and deep-dive analytics.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all w-full md:w-56"
              />
            </div>
            
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="" className="bg-[#0a0a0a]">All Payments</option>
              <option value="Credit Card" className="bg-[#0a0a0a]">Credit Card</option>
              <option value="Debit Card" className="bg-[#0a0a0a]">Debit Card</option>
              <option value="eWallet" className="bg-[#0a0a0a]">eWallet</option>
              <option value="Cash" className="bg-[#0a0a0a]">Cash</option>
            </select>

            <button 
              onClick={() => {
                setSearch('');
                setPaymentMethod('');
                setDateRange({ start: '', end: '' });
              }}
              className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-white/5 rounded transition-all"
              title="Reset Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Metric Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Revenue" 
            value={formatCurrency(metrics.totalRevenue)} 
            trend="+12.5%"
          />
          <MetricCard 
            title="Total Orders" 
            value={metrics.totalOrders.toString()} 
            trend="+4.2%"
          />
          <MetricCard 
            title="Conversion Rate" 
            value="3.18%" 
            trend="-0.4%"
            isNegativeTrend
          />
          <MetricCard 
            title="Top Product" 
            value={metrics.bestSeller} 
            subtitle="Current Leader"
          />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Over Time */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#141414] p-6 rounded-xl border border-white/5 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-medium tracking-tight">Revenue Dynamics</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Daily transaction flow</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-bold uppercase rounded-sm transition-all hover:bg-emerald-400">7D</button>
                <button className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase rounded-sm border border-white/10 hover:text-white transition-all">30D</button>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141414',
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment breakdown */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] p-6 rounded-xl border border-white/5 shadow-2xl"
          >
            <h3 className="text-white font-medium mb-8 tracking-tight">Payment Allocation</h3>
            <div className="h-[260px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="method"
                    stroke="none"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141414',
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Share</span>
                <span className="text-xl font-bold text-white">100%</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {paymentData.map((d, i) => (
                <div key={d.method} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-gray-400 font-medium truncate">{d.method}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141414] p-6 rounded-xl border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-medium tracking-tight">Product Utilization</h3>
              <div className="w-4 h-4 rounded-sm border border-emerald-500/40 bg-emerald-500/10" />
            </div>
            
            <div className="space-y-6">
              {productData.map((prod, idx) => (
                <div key={prod.product} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 truncate max-w-[200px]">{prod.product}</span>
                    <span className="text-white font-medium">{formatCurrency(prod.revenue)}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(prod.revenue / metrics.totalRevenue) * 300}%` }} // Adjusted relative width logic
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141414] rounded-xl border border-white/5 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Transactions</h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider">Identifier</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSales.slice(0, 6).map((sale, idx) => (
                    <motion.tr 
                      key={`${sale.orderNumber}-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-gray-500 group-hover:text-emerald-400 transition-colors">
                          {sale.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-200 truncate max-w-[150px]">{sale.product}</div>
                        <div className="text-[10px] text-gray-600 font-medium tracking-tight mt-0.5">{sale.date}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(sale.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Settled</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-white/[0.02] text-center border-t border-white/5">
              <button className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-all">
                Full ledger access
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex gap-6 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Nodes</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Security</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">API</span>
          </div>
          <p className="text-[11px] text-gray-700 font-medium">© 2026 DATAFLUX SYSTEMS. ENCRYPTED END-TO-END.</p>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ title, value, trend, subtitle, isNegativeTrend }: {
  title: string;
  value: string;
  trend?: string;
  subtitle?: string;
  isNegativeTrend?: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#141414] border border-white/5 p-4 rounded-xl shadow-xl hover:border-white/10 transition-all cursor-default"
    >
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{title}</p>
      <div className="flex items-end gap-2">
        <h2 className="text-xl font-bold text-white tracking-tight leading-none">{value}</h2>
        {trend && (
          <span className={`text-[9px] font-bold mb-0.5 tracking-tighter ${
            isNegativeTrend ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      {subtitle ? (
        <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase tracking-wider">{subtitle}</p>
      ) : (
        <div className="mt-3 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${isNegativeTrend ? 'bg-red-400 w-1/3' : 'bg-emerald-500 w-2/3'}`} />
        </div>
      )}
    </motion.div>
  );
}

