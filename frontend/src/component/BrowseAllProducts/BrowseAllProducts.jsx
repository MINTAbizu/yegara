// import React, { useState } from 'react';
// import { 
//   Globe, Search, Bell, ShoppingBag, Truck, ShieldCheck, 
//   DollarSign, Megaphone, ArrowUpRight, BookOpen, Gift, 
//   Package, Laptop, Filter, Plus, ExternalLink, Heart
// } from 'lucide-react';

// const InternationalMarketplaceDashboard = () => {
//   const [activeTab, setActiveTab] = useState('products');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [currency, setCurrency] = useState('USD');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Expanded dynamic product catalog including Books, Gifts, Physical & Digital items
//   const products = [
//     { id: 1, title: 'Handcrafted Ethiopian Coffee Table', country: '🇪🇹 ET', price: 180, category: 'Physical', status: 'In Stock', stock: 12 },
//     { id: 2, title: 'E-Commerce UI/UX Starter Kit', country: '🇺🇸 US', price: 49, category: 'Digital', status: 'Instant Download', stock: '∞' },
//     { id: 3, title: 'The Art of Modern Craftsmanship (Hardcover)', country: '🇬🇧 UK', price: 32, category: 'Books', status: 'In Stock', stock: 45 },
//     { id: 4, title: 'Handmade Leather Gift Set & Wallet', country: '🇮🇹 IT', price: 85, category: 'Gifts', status: 'Limited Edition', stock: 5 },
//     { id: 5, title: 'Organic Yirgacheffe Coffee Beans (1kg)', country: '🇪🇹 ET', price: 24, category: 'Physical', status: 'In Stock', stock: 120 },
//     { id: 6, title: 'Full-Stack SaaS Boilerplate Code', country: '🇩🇪 DE', price: 99, category: 'Digital', status: 'Instant Download', stock: '∞' },
//     { id: 7, title: 'Historical Horn of Africa Anthology', country: '🇪🇹 ET', price: 28, category: 'Books', status: 'In Stock', stock: 18 },
//     { id: 8, title: 'Customized Wooden Souvenir Box', country: '🇰🇪 KE', price: 40, category: 'Gifts', status: 'Made to Order', stock: 8 },
//   ];

//   // Dynamic platform services stream
//   const services = [
//     { id: 1, name: 'Cross-Border Express Delivery', icon: Truck, desc: 'Global shipping with automated customs clearance', status: 'Active', type: 'Logistics' },
//     { id: 2, name: 'Multi-Currency Escrow Guard', icon: ShieldCheck, desc: 'Secure payment release upon verified buyer delivery', status: 'Protected', type: 'Finance' },
//     { id: 3, name: 'Global Marketplace Ad Campaigns', icon: Megaphone, desc: 'Targeted promotion across regional shopping feeds', status: 'Available', type: 'Marketing' },
//     { id: 4, name: 'Automated VAT/GST Compliance', icon: DollarSign, desc: 'Real-time tax handling for 50+ countries', status: 'Active', type: 'Finance' },
//   ];

//   // Filter products by search and category
//   const filteredProducts = products.filter(item => {
//     const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
//     const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
//       {/* Central Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-y-auto">
//         {/* Navigation Bar */}
//         <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <span className="font-extrabold text-xl text-blue-600 tracking-tight">Yegara Hub</span>
//             <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">International</span>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search global marketplace..." 
//                 className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50"
//               />
//             </div>

//             <select 
//               value={currency} 
//               onChange={(e) => setCurrency(e.target.value)}
//               className="border rounded-lg px-2.5 py-1.5 text-sm font-semibold bg-gray-50 text-gray-700"
//             >
//               <option value="USD">USD ($)</option>
//               <option value="EUR">EUR (€)</option>
//               <option value="ETB">ETB (Br)</option>
//             </select>

//             <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
//             </button>
//           </div>
//         </header>

//         {/* Dashboard Main Workspace */}
//         <main className="p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Global Marketplace Dashboard</h1>
//               <p className="text-sm text-gray-500">Manage cross-border inventories, platform services, and multi-currency orders.</p>
//             </div>
//             <div className="flex gap-3">
//               <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5">
//                 <Plus className="h-4 w-4" /> Add Platform Service
//               </button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5 shadow-sm">
//                 <Plus className="h-4 w-4" /> Add New Product
//               </button>
//             </div>
//           </div>

//           {/* Quick Stats Grid */}
//           <div className="grid grid-cols-4 gap-4">
//             <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex justify-between items-center text-gray-400">
//                 <p className="text-xs font-semibold uppercase">Total Listings</p>
//                 <Package className="h-4 w-4 text-blue-500" />
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mt-2">14,250</p>
//             </div>
//             <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex justify-between items-center text-gray-400">
//                 <p className="text-xs font-semibold uppercase">Digital & Books</p>
//                 <BookOpen className="h-4 w-4 text-purple-500" />
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mt-2">5,120</p>
//             </div>
//             <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex justify-between items-center text-gray-400">
//                 <p className="text-xs font-semibold uppercase">Gifts & Crafts</p>
//                 <Gift className="h-4 w-4 text-pink-500" />
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mt-2">2,840</p>
//             </div>
//             <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex justify-between items-center text-gray-400">
//                 <p className="text-xs font-semibold uppercase">Platform Services</p>
//                 <ShieldCheck className="h-4 w-4 text-green-500" />
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mt-2">32 Active</p>
//             </div>
//           </div>

//           {/* Workspace Body Placeholder */}
//           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[380px] flex flex-col items-center justify-center text-center">
//             <Globe className="h-12 w-12 text-blue-200 mb-3" />
//             <h3 className="text-lg font-semibold text-gray-700">Central Analytics & Marketplace Feed</h3>
//             <p className="text-sm text-gray-400 max-w-md mt-1">Real-time international sales activity, regional traffic insights, and fulfillment charts will render here.</p>
//           </div>
//         </main>
//       </div>

//       {/* DYNAMIC RIGHT SIDEBAR */}
//       <aside className="w-[410px] bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
        
//         {/* Sidebar Top Header */}
//         <div className="p-4 border-b border-gray-200 space-y-3">
//           <div className="flex items-center justify-between">
//             <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
//               <Globe className="h-4 w-4 text-blue-600" /> Dynamic Live Feed
//             </h2>
//             <span className="flex h-2 w-2 relative">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//             </span>
//           </div>

//           {/* Main Tab Toggle */}
//           <div className="flex bg-gray-100 p-1 rounded-lg">
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
//                 activeTab === 'products' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
//               }`}
//             >
//               All Products ({products.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('services')}
//               className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
//                 activeTab === 'services' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
//               }`}
//             >
//               Services ({services.length})
//             </button>
//           </div>

//           {/* Category Filter Pills (Only visible when Products tab is active) */}
//           {activeTab === 'products' && (
//             <div className="space-y-2">
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
//                 <input 
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Filter listings..."
//                   className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
//                 />
//               </div>

//               <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
//                 {['All', 'Physical', 'Digital', 'Books', 'Gifts'].map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${
//                       selectedCategory === cat 
//                         ? 'bg-blue-600 text-white' 
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Dynamic Items Stream */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {activeTab === 'products' ? (
//             filteredProducts.length > 0 ? (
//               filteredProducts.map((item) => (
//                 <div key={item.id} className="p-3 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 rounded-xl transition duration-150 group">
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-gray-600">{item.country}</span>
//                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
//                       item.category === 'Digital' ? 'bg-purple-100 text-purple-700' :
//                       item.category === 'Books' ? 'bg-blue-100 text-blue-700' :
//                       item.category === 'Gifts' ? 'bg-pink-100 text-pink-700' :
//                       'bg-green-100 text-green-700'
//                     }`}>
//                       {item.category}
//                     </span>
//                   </div>

//                   <h3 className="font-semibold text-sm text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition">
//                     {item.title}
//                   </h3>

//                   <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60 text-xs">
//                     <span className="text-gray-500 font-medium">{item.status} ({item.stock})</span>
//                     <div className="flex items-center gap-2">
//                       <span className="font-extrabold text-gray-900">${item.price} {currency}</span>
//                       <button className="p-1 hover:bg-white rounded text-gray-400 hover:text-blue-600">
//                         <ExternalLink className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-xs text-center text-gray-400 py-8">No products matching your search criteria.</p>
//             )
//           ) : (
//             /* Platform Services List */
//             services.map((svc) => {
//               const IconComponent = svc.icon;
//               return (
//                 <div key={svc.id} className="p-3.5 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 rounded-xl transition duration-150">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//                       <IconComponent className="h-4 w-4" />
//                     </div>
//                     <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
//                       {svc.type}
//                     </span>
//                   </div>

//                   <h3 className="font-semibold text-sm text-gray-900">{svc.name}</h3>
//                   <p className="text-xs text-gray-500 mt-1 leading-snug">{svc.desc}</p>

//                   <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60 text-xs">
//                     <span className="text-green-600 font-semibold flex items-center gap-1">
//                       ● {svc.status}
//                     </span>
//                     <button className="text-blue-600 font-bold flex items-center hover:underline">
//                       Configure <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Live Sync Sidebar Footer */}
//         <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
//           <p className="text-xs text-gray-400 font-medium">⚡ Connected to International Data Stream</p>
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default InternationalMarketplaceDashboard;

