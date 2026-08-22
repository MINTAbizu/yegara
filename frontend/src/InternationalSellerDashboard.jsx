import React, { useState } from 'react';
import { 
  Globe, DollarSign, Wallet, ArrowUpRight, TrendingUp, 
  BookOpen, Share2, Heart, Award, ShieldCheck, Download, 
  CreditCard, ChevronRight, RefreshCcw, Lock, Truck, Users, BarChart3
} from 'lucide-react';

export default function AdvancedYegaraSellerDashboard() {
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('all');

  // Key platform metrics categorized by Yegara revenue streams
  const stats = [
    { label: 'Total Revenue (GMV)', usd: '$148,290.00', etb: '17,201,640 ETB', change: '+18.4%', sub: 'All Streams' },
    { label: 'Crowdfunding Backers', usd: '$42,800.00', etb: '4,964,800 ETB', change: '+24.1%', sub: '3 Active Campaigns' },
    { label: 'Escrowed Deals (Social Accounts)', usd: '$12,400.00', etb: '1,438,400 ETB', change: '+9.5%', sub: '2 Telegram/FB Pending' },
    { label: 'Bounty & Referral Earnings', usd: '$3,850.00', etb: '446,600 ETB', change: '+14.2%', sub: '128 Converted Clicks' },
  ];

  // Multi-stream sales history tailored to Yegara sidebar links
  const transactions = [
    { id: 'YEG-9082', title: 'Modern Amharic Tech Guide (E-Book)', category: 'My Books', buyer: 'Diaspora (US)', amount: '$45.00', payout: 'Direct', status: 'Completed' },
    { id: 'YEG-9081', title: 'Tech Hub Fundraiser', category: 'Crowdfunding', buyer: 'Global Backer (UK)', amount: '$500.00', payout: 'Escrow Released', status: 'Completed' },
    { id: 'YEG-9080', title: 'Verified Telegram Channel (50k subs)', category: 'Social Account', buyer: 'Ethiopia Business', amount: '$1,200.00', payout: 'In Escrow', status: 'Verification' },
    { id: 'YEG-9079', title: 'Pro Account Affiliate Bounty', category: 'Bounty Link', buyer: 'Ref #DEBO-992', amount: '$25.00', payout: 'Instant', status: 'Completed' },
    { id: 'YEG-9078', title: 'Handmade Leather Export Pack', category: 'Physical Product', buyer: 'Buyer (Germany)', amount: '$340.00', payout: 'DDP Shipment', status: 'In Transit' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Yegara Merchant Pro
            </span>
            <span className="text-slate-500 text-xs font-mono">Seller ID: DEBO-INT-8839</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">International Seller & Creator Dashboard</h1>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Base Currency Selector */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm shadow-sm">
            <Globe className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-slate-500 text-xs mr-2">Currency:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="ETB">ETB (Br)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <button className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
            <Download className="w-4 h-4" /> Export FX Report
          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
            + Add Product / Campaign
          </button>
        </div>
      </div>

      {/* Compliance & Exchange Rate Bar */}
      <div className="mt-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Cross-Border Foreign Exchange & Local Settlement Active</h4>
            <p className="text-xs text-slate-300">Automated conversion to Commercial Bank of Ethiopia (CBE), Telebirr, or SWIFT Wire</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right hidden sm:block">
            <p className="text-slate-400">Guaranteed FX Rate</p>
            <p className="font-bold text-emerald-400">1 USD = 116.02 ETB</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold text-xs transition border border-blue-400">
            Configure Bank Details
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {item.change}
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-2xl font-black text-slate-900">
                {currency === 'USD' ? item.usd : item.etb}
              </h2>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-500">{currency === 'USD' ? `≈ ${item.etb}` : `≈ ${item.usd}`}</span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{item.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Multi-Stream Transactions Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Multi-Stream Activity</h3>
              <p className="text-xs text-slate-500">Books, Crowdfunding, Social Accounts Escrow, & Physical Export Orders</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button onClick={() => setActiveTab('all')} className={`px-2 py-1 rounded ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'}`}>All</button>
              <button onClick={() => setActiveTab('escrow')} className={`px-2 py-1 rounded ${activeTab === 'escrow' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'}`}>Escrow</button>
              <button onClick={() => setActiveTab('books')} className={`px-2 py-1 rounded ${activeTab === 'books' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'}`}>Books</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Item / Campaign</th>
                  <th className="py-3 px-3">Module</th>
                  <th className="py-3 px-3">Buyer / Origin</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payout Mode</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{tx.title}</div>
                      <div className="text-slate-400 text-[10px] font-mono">{tx.id}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold text-[11px] border border-slate-200">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">{tx.buyer}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{tx.amount}</td>
                    <td className="py-3.5 px-3 text-slate-500 font-medium">{tx.payout}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        tx.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local Settlement & Escrow Summary Panel */}
        <div className="space-y-6">
          
          {/* Bank Withdrawal Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Global Settlement & Payout</h3>
            <p className="text-xs text-slate-500 mb-4">Direct transfer foreign earnings into your local account</p>

            <div className="bg-slate-950 text-white rounded-xl p-4 mb-4 border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Available Balance</span>
                <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Auto-Payout Ready</span>
              </div>
              <div className="text-3xl font-black text-white">$42,850.00 <span className="text-xs text-slate-400 font-normal">USD</span></div>
              <div className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center">
                <span>Local Bank Equivalent:</span>
                <span className="font-extrabold text-emerald-400 text-sm">4,971,457.00 ETB</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" /> Transfer to Local Ethiopian Bank
              </button>
              <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition border border-slate-300 flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Withdraw via SWIFT / Foreign Wire
              </button>
            </div>
          </div>

          {/* Social Accounts & Crowdfunding Escrow Lock */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Active Escrow Protection</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Funds held safely until buyer confirms account transfer or campaign goals are met.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
              <div className="flex justify-between font-bold text-amber-900">
                <span>Total Held in Escrow:</span>
                <span>$12,400.00 USD</span>
              </div>
              <div className="text-[11px] text-amber-700 mt-1">2 Social Accounts pending verification</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}