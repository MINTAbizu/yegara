import React, { useState } from 'react';
import { 
  Globe2, DollarSign, TrendingUp, Ship, ShieldCheck, 
  ArrowUpRight, Download, RefreshCw, Layers, CreditCard,
  Building2, AlertTriangle, ChevronDown, Filter
} from 'lucide-react';

export default function InternationalSellerDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // KPI Metrics
  const metrics = [
    { label: 'Global GMV (Gross Revenue)', value: '$148,290.00', subtext: '≈ 17,201,640 ETB', change: '+18.4%', trend: 'up' },
    { label: 'Cross-Border Shipments', value: '3,842', subtext: '24 Target Countries', change: '+12.1%', trend: 'up' },
    { label: 'Customs & Tax Held', value: '$3,120.00', subtext: 'Duties Pre-cleared (DDP)', change: '-4.2%', trend: 'down' },
    { label: 'Net Foreign Payout', value: '$42,850.00', subtext: 'Ready for SWIFT / Local Bank', change: '+8.7%', trend: 'up' },
  ];

  // International Orders
  const internationalOrders = [
    { id: 'EXP-9082', destination: '🇺🇸 United States', buyer: 'Global Logistics LLC', amount: '$1,250.00', incoterm: 'DDP', carrier: 'DHL Express', status: 'Customs Cleared' },
    { id: 'EXP-9081', destination: '🇬🇧 United Kingdom', buyer: 'London Afro-Hub', amount: '$840.00', incoterm: 'DAP', carrier: 'FedEx Int.', status: 'In Transit' },
    { id: 'EXP-9080', destination: '🇦🇪 UAE (Dubai)', buyer: 'Emirates Trading Co.', amount: '$3,400.00', incoterm: 'DDP', carrier: 'Aramex', status: 'Processing' },
    { id: 'EXP-9079', destination: '🇩🇪 Germany', buyer: 'Müller Imports', amount: '$620.00', incoterm: 'DDP', carrier: 'DHL Express', status: 'Out for Delivery' },
  ];

  // Top Global Markets
  const topMarkets = [
    { country: 'United States', code: 'US', revenue: '$64,200', share: '43%' },
    { country: 'United Arab Emirates', code: 'AE', revenue: '$32,100', share: '21%' },
    { country: 'United Kingdom', code: 'GB', revenue: '$22,500', share: '15%' },
    { country: 'European Union', code: 'EU', revenue: '$18,100', share: '12%' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
              Global Merchant
            </span>
            <span className="text-slate-500 text-sm">Seller ID: DEBO-INT-8839</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Cross-Border Dashboard</h1>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Base Currency Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm">
            <Globe2 className="w-4 h-4 text-slate-400 mr-2" />
            <span className="text-slate-400 mr-2 text-xs">Display Currency:</span>
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="USD" className="bg-slate-900">USD ($)</option>
              <option value="EUR" className="bg-slate-900">EUR (€)</option>
              <option value="GBP" className="bg-slate-900">GBP (£)</option>
              <option value="ETB" className="bg-slate-900">ETB (Br)</option>
            </select>
          </div>

          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition">
            <Download className="w-4 h-4" /> Tax & Tariff Report
          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-600/20">
            <Ship className="w-4 h-4" /> Create Export Shipment
          </button>
        </div>
      </div>

      {/* Global Compliance & FX Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Cross-Border Tax & Compliance Status</h4>
            <p className="text-xs text-slate-400">US-Sales Tax (100% Compliant) • EU IOSS Registered • DDP Clearance Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right hidden sm:block">
            <p className="text-slate-400">Live FX Guarantee Rate</p>
            <p className="font-semibold text-emerald-400">1 USD = 116.02 ETB</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md font-medium text-xs transition border border-slate-700">
            Configure Payout Banks
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {metrics.map((item, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {item.change}
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{item.value}</h2>
              <p className="text-xs text-slate-400 mt-1">{item.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Recent International Shipments / Orders */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Active Cross-Border Orders</h3>
              <p className="text-xs text-slate-400">Real-time tracking, Incoterms, and customs status</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 text-xs border border-slate-700">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Order / Buyer</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Incoterm</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Logistics</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {internationalOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-blue-400">{order.id}</div>
                      <div className="text-slate-400 text-[11px]">{order.buyer}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">{order.destination}</td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                        {order.incoterm}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{order.amount}</td>
                    <td className="py-3 px-3 text-slate-300">{order.carrier}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                        order.status === 'Customs Cleared' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        order.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Payouts & Market Distribution */}
        <div className="space-y-6">
          
          {/* Multi-Currency Settlement Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-white mb-1">Global Payout Settlement</h3>
            <p className="text-xs text-slate-400 mb-4">Direct Wire (SWIFT), Stripe Connect, or Local Bank</p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 mb-4">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Available Balance</span>
                <span className="text-emerald-400 font-medium">Auto-Payout Ready</span>
              </div>
              <div className="text-2xl font-black text-white">$42,850.00 <span className="text-xs text-slate-500 font-normal">USD</span></div>
              <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>Local Equivalent:</span>
                <span className="text-slate-200 font-semibold">4,971,457.00 ETB</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Withdraw via SWIFT / Wire
              </button>
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition border border-slate-700 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" /> Payout to Local Ethiopian Bank
              </button>
            </div>
          </div>

          {/* Regional Market Share */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-white mb-3">Top Export Markets</h3>
            <div className="space-y-3">
              {topMarkets.map((market, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-semibold">{market.code}</span>
                    <span className="text-slate-200 font-medium">{market.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{market.revenue}</span>
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-700">
                      {market.share}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}