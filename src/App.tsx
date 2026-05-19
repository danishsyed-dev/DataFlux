/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, ShoppingCart, DollarSign, TrendingUp, Search,
  CreditCard, ArrowUpRight, ArrowDownRight, Package,
  Settings, BarChart3, Users, Bell, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SALES_DATA } from './data';
import {
  getDailySales, getProductStats, getPaymentStats,
  getOverallMetrics, filterData
} from './utils/data-processing';

/* ─── Color tokens for charts ──────────────── */
const CHART_COLORS = ['#f0b429', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c'];
const AREA_GRADIENT_ID = 'revenueGradient';

/* ─── Custom Recharts Tooltip ──────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a2230',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
      color: '#e2e8f0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <p style={{ color: '#8896ab', marginBottom: 4, fontSize: 11 }}>
        {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}>
          ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

/* ─── Sidebar Navigation ──────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: ShoppingCart, label: 'Orders', active: false },
  { icon: Package, label: 'Products', active: false },
  { icon: Users, label: 'Customers', active: false },
];

const NAV_BOTTOM = [
  { icon: Settings, label: 'Settings', active: false },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">D</div>
          <span className="sidebar-logo-text">DataFlux</span>
        </div>

        <p className="sidebar-section-label">Main</p>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} className={`sidebar-link ${item.active ? 'active' : ''}`}>
              <item.icon />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <nav className="sidebar-nav" style={{ marginBottom: 8 }}>
          {NAV_BOTTOM.map((item) => (
            <a key={item.label} className={`sidebar-link ${item.active ? 'active' : ''}`}>
              <item.icon />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="user-avatar">DA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
                Danish S.
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── Metric Card ────────────────────────── */
function MetricCard({ title, value, trend, trendDirection, icon: Icon, accentColor, delay = 0 }: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon: React.ElementType;
  accentColor: string;
  delay?: number;
}) {
  const isPositive = trendDirection === 'up';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="metric-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="metric-label">{title}</span>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: accentColor + '14',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: 17, height: 17, color: accentColor }} />
        </div>
      </div>
      <div className="metric-row" style={{ marginTop: 8 }}>
        <span className="metric-value" style={{ fontSize: 26, color: 'var(--text-primary)' }}>
          {value}
        </span>
        {trend && (
          <span className="badge" style={{
            background: isPositive ? 'var(--success-muted)' : 'var(--danger-muted)',
            color: isPositive ? 'var(--success)' : 'var(--danger)',
            marginBottom: 4,
          }}>
            {isPositive
              ? <ArrowUpRight style={{ width: 12, height: 12 }} />
              : <ArrowDownRight style={{ width: 12, height: 12 }} />
            }
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main App ───────────────────────────── */
export default function App() {
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dateRange] = useState({ start: '', end: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('All');

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
  const productData = useMemo(() => getProductStats(filteredSales).slice(0, 6), [filteredSales]);
  const paymentData = useMemo(() => getPaymentStats(filteredSales), [filteredSales]);

  const maxProductRevenue = productData[0]?.revenue || 1;

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Area */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
            >
              {sidebarOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
            <div>
              <h1 style={{
                fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0,
                fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
              }}>
                Sales Overview
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 6,
              background: 'var(--success-muted)', fontSize: 11, fontWeight: 600, color: 'var(--success)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--success)',
                animation: 'pulse 2s ease infinite',
              }} />
              Live
            </div>
            <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>

            <button style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: 4, position: 'relative',
            }}>
              <Bell style={{ width: 18, height: 18 }} />
              <span style={{
                position: 'absolute', top: 2, right: 2, width: 6, height: 6,
                borderRadius: '50%', background: 'var(--accent)',
              }} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {/* ─── Filter Bar ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              justifyContent: 'space-between', gap: 12, marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 15, height: 15, color: 'var(--text-muted)',
                }} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="filter-select"
              >
                <option value="">All Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="eWallet">eWallet</option>
                <option value="Cash">Cash</option>
              </select>

              {(search || paymentMethod) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => { setSearch(''); setPaymentMethod(''); }}
                  style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-secondary)', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Clear filters
                </motion.button>
              )}
            </div>

            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {filteredSales.length} transactions • Aug–Oct 2025
            </span>
          </motion.div>

          {/* ─── Metric Cards ──────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16, marginBottom: 24,
          }}>
            <MetricCard
              title="Total Revenue"
              value={fmt(metrics.totalRevenue)}
              trend="12.5%"
              trendDirection="up"
              icon={DollarSign}
              accentColor="#f0b429"
              delay={0.05}
            />
            <MetricCard
              title="Total Orders"
              value={metrics.totalOrders.toString()}
              trend="4.2%"
              trendDirection="up"
              icon={ShoppingCart}
              accentColor="#60a5fa"
              delay={0.1}
            />
            <MetricCard
              title="Avg. Order Value"
              value={fmt(metrics.avgOrderValue)}
              trend="2.1%"
              trendDirection="up"
              icon={TrendingUp}
              accentColor="#34d399"
              delay={0.15}
            />
            <MetricCard
              title="Top Seller"
              value={metrics.bestSeller.split(' ').slice(0, 3).join(' ')}
              icon={Package}
              accentColor="#a78bfa"
              delay={0.2}
            />
          </div>

          {/* ─── Charts Row ──────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 16, marginBottom: 24,
          }}>
            {/* Revenue Area Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="chart-panel"
            >
              <div className="chart-panel-header">
                <span className="chart-panel-title">Revenue Trend</span>
                <div className="pill-tabs">
                  {['7D', '30D', 'All'].map((range) => (
                    <button
                      key={range}
                      className={`pill-tab ${activeTimeRange === range ? 'active' : ''}`}
                      onClick={() => setActiveTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-panel-body" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f0b429" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#f0b429" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#4e5d73', fontFamily: 'DM Sans' }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#4e5d73', fontFamily: 'DM Sans' }}
                      tickFormatter={(v) => `$${v}`}
                      width={48}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f0b429"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#${AREA_GRADIENT_ID})`}
                      dot={false}
                      activeDot={{ r: 4, fill: '#f0b429', stroke: '#1a2230', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Payment Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="chart-panel"
            >
              <div className="chart-panel-header">
                <span className="chart-panel-title">Payment Split</span>
                <CreditCard style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
              </div>
              <div className="chart-panel-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={76}
                        paddingAngle={3}
                        dataKey="revenue"
                        nameKey="method"
                        stroke="none"
                      >
                        {paymentData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1a2230', borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.09)',
                          fontSize: 12, color: '#e2e8f0',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                        formatter={(value: number) => [fmt(value), 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div style={{ width: '100%', marginTop: 4 }}>
                  {paymentData.map((d, i) => (
                    <div key={d.method} className="payment-legend-item">
                      <div
                        className="payment-legend-dot"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="payment-legend-label">{d.method}</span>
                      <span className="payment-legend-value">{fmt(d.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── Bottom Row ──────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            gap: 16,
          }}>
            {/* Product Performance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="chart-panel"
            >
              <div className="chart-panel-header">
                <span className="chart-panel-title">Top Products</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                  by revenue
                </span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {productData.map((prod, idx) => (
                  <motion.div
                    key={prod.product}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.06 }}
                    style={{ marginBottom: idx < productData.length - 1 ? 16 : 0 }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 6,
                    }}>
                      <span style={{
                        fontSize: 12.5, color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: 180,
                      }}>
                        {prod.product}
                      </span>
                      <span style={{
                        fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {fmt(prod.revenue)}
                      </span>
                    </div>
                    <div className="product-bar-track">
                      <motion.div
                        className="product-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(prod.revenue / maxProductRevenue) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.5 + idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          background: CHART_COLORS[idx % CHART_COLORS.length],
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="chart-panel"
            >
              <div className="chart-panel-header">
                <span className="chart-panel-title">Recent Transactions</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {filteredSales.length} total
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Product</th>
                      <th>Method</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.slice(0, 7).map((sale, idx) => (
                      <motion.tr
                        key={`${sale.orderNumber}-${idx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 + idx * 0.04 }}
                      >
                        <td>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 12,
                            color: 'var(--text-muted)',
                          }}>
                            {sale.orderNumber}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{
                              color: 'var(--text-primary)', fontWeight: 500, fontSize: 13,
                              maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {sale.product}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12 }}>{sale.paymentMethod}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontWeight: 600,
                            color: 'var(--text-primary)', fontSize: 13,
                          }}>
                            {fmt(sale.price)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="badge badge-success">Settled</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
