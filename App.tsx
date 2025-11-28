import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MOUDocument from './components/MOUDocument';
import InvoiceDocument from './components/InvoiceDocument';
import SmartArchitect from './pages/SmartArchitect';
import { SHAPESPIRE_INFO, MOCK_SCOPE_ITEMS } from './constants';

// Layout wrapper to handle Sidebar
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'bg-shapespire-green text-white' : 'text-gray-600 hover:bg-gray-100';

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 no-print">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-shapespire-green text-white rounded flex items-center justify-center font-bold text-xl">S</div>
                    <div>
                        <h1 className="font-bold text-gray-800 leading-tight">ShapeSpire<br/><span className="text-shapespire-gold">Nexus</span></h1>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className={`block px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/')}`}>
                        📊 Dashboard
                    </Link>
                    <Link to="/mou" className={`block px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/mou')}`}>
                        📝 Contracts (MOU)
                    </Link>
                    <Link to="/invoices" className={`block px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/invoices')}`}>
                        💰 Invoices
                    </Link>
                    <Link to="/ai-tools" className={`block px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/ai-tools')}`}>
                        🤖 Smart Architect
                    </Link>
                </nav>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                        <div>
                            <p className="text-sm font-bold">{SHAPESPIRE_INFO.founder}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Overview: Boisabi Resort</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-shapespire-green">
                    <p className="text-sm text-gray-500 uppercase font-bold mb-1">Contract Value</p>
                    <p className="text-3xl font-bold text-gray-800">BDT 4.8M</p>
                    <p className="text-xs text-green-600 mt-2">↑ Active for 2024-2025</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-shapespire-gold">
                    <p className="text-sm text-gray-500 uppercase font-bold mb-1">Pending Tasks</p>
                    <p className="text-3xl font-bold text-gray-800">3</p>
                    <p className="text-xs text-gray-400 mt-2">Design & Construction</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                    <p className="text-sm text-gray-500 uppercase font-bold mb-1">Outstanding Invoices</p>
                    <p className="text-3xl font-bold text-gray-800">BDT 0</p>
                    <p className="text-xs text-green-600 mt-2">All payments up to date</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Tasks */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Active Scope Items</h3>
                    <div className="space-y-4">
                        {MOCK_SCOPE_ITEMS.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-700">{item.description}</p>
                                    <p className="text-xs text-gray-500">{item.category} • {item.timeline}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    item.status === 'In_Progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-shapespire-green to-green-900 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                         <Link to="/mou" className="block w-full text-center bg-white/10 hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm transition">
                            View Master Agreement
                         </Link>
                         <Link to="/invoices" className="block w-full text-center bg-white/10 hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm transition">
                            Generate New Invoice
                         </Link>
                         <Link to="/ai-tools" className="block w-full text-center bg-shapespire-gold hover:bg-yellow-600 text-black font-bold p-3 rounded-lg transition shadow-lg">
                            ✨ Consult Smart Architect AI
                         </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <Router>
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/mou" element={<MOUDocument />} />
                <Route path="/invoices" element={<InvoiceDocument />} />
                <Route path="/ai-tools" element={
                    <div className="p-8 h-full flex flex-col">
                         <h2 className="text-2xl font-bold text-gray-800 mb-2">Smart Architect AI</h2>
                         <p className="text-gray-500 mb-6">Powered by Gemini 3.0 Pro & Veo</p>
                         <SmartArchitect />
                    </div>
                } />
            </Routes>
        </Layout>
    </Router>
  );
};

export default App;
