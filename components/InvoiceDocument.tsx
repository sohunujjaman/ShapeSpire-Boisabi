import React, { useState } from 'react';
import { SHAPESPIRE_INFO, BOISABI_INFO, MOCK_INVOICES, PROJECT_SERVICES } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceDocument: React.FC = () => {
    const [status, setStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('PENDING');
    const invoice = MOCK_INVOICES[0]; 

    const handlePayment = () => {
        // Mocking SSLCommerz payment flow
        const confirmed = window.confirm("Redirecting to SSLCommerz Gateway...\n\n(Simulated: Click OK to complete payment)");
        if(confirmed) {
            setStatus('PAID');
        }
    }

    const downloadPDF = async () => {
        const input = document.getElementById('invoice-content');
        if (input) {
          const canvas = await html2canvas(input, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Invoice-${invoice.id}.pdf`);
        }
    };

    return (
        <div className="bg-gray-100 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
                 <div className="space-x-4">
                     {status !== 'PAID' && (
                        <button 
                            onClick={handlePayment}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-lg"
                        >
                            💳 Pay with SSLCommerz
                        </button>
                     )}
                 </div>
                 <button 
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Download PDF
                </button>
            </div>

            <div id="invoice-content" className="bg-white p-12 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 p-12 transform rotate-0`}>
                    <div className={`border-4 text-2xl font-black px-4 py-1 rounded transform rotate-12 ${
                        status === 'PAID' ? 'border-green-600 text-green-600' : 
                        status === 'OVERDUE' ? 'border-red-600 text-red-600' : 'border-yellow-500 text-yellow-500'
                    }`}>
                        {status}
                    </div>
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-16">
                    <div>
                        <div className="text-4xl font-bold text-shapespire-green mb-1">INVOICE</div>
                        <p className="text-gray-500 font-mono">#{invoice.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-xl text-gray-800">{SHAPESPIRE_INFO.name}</h2>
                        <p className="text-sm text-gray-600 w-64 ml-auto">{SHAPESPIRE_INFO.address}</p>
                        <p className="text-sm text-gray-600">{SHAPESPIRE_INFO.contact}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12 flex justify-between">
                    <div>
                        <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">Bill To:</h3>
                        <h4 className="font-bold text-lg">{BOISABI_INFO.name}</h4>
                        <p className="text-gray-600">{BOISABI_INFO.location}</p>
                    </div>
                    <div className="text-right">
                         <div className="mb-2">
                             <span className="text-gray-500 text-sm mr-4">Invoice Date:</span>
                             <span className="font-bold">{invoice.date}</span>
                         </div>
                         <div>
                             <span className="text-gray-500 text-sm mr-4">Due Date:</span>
                             <span className="font-bold text-red-600">{invoice.dueDate}</span>
                         </div>
                    </div>
                </div>

                {/* Invoice Items (Simplified without detailed cost breakdown as requested) */}
                <table className="w-full mb-8">
                    <thead className="bg-shapespire-green text-white">
                        <tr>
                            <th className="p-3 text-left">Description of Services</th>
                            <th className="p-3 text-center">Reference</th>
                            <th className="p-3 text-right">Amount (BDT)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100 align-top">
                                <td className="p-4">
                                    <p className="font-bold text-gray-800">{item.description}</p>
                                    {/* Using PROJECT_SERVICES to populate details dynamically based on category */}
                                    <div className="mt-2 text-xs text-gray-500 space-y-1 pl-2 border-l-2 border-gray-200">
                                        {PROJECT_SERVICES.find(s => s.title.includes(item.category) || (item.category === 'Construction' && s.title.includes('Architectural')) || (item.category === 'Design' && s.title.includes('Brand')))?.items.slice(0, 4).map((sub, i) => (
                                            <p key={i}>• {sub.description.split(':')[0]}</p>
                                        ))}
                                        <p className="italic text-[10px] pt-1">...and related services as per MOU.</p>
                                    </div>
                                </td>
                                <td className="p-4 text-center text-sm text-gray-500">{item.category} Phase</td>
                                <td className="p-4 text-right font-mono">{item.cost.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Detailed Service List (Included as text per request) */}
                <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 uppercase text-xs tracking-wider">Services Included in this Invoice</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROJECT_SERVICES.map((service, idx) => (
                            <div key={idx}>
                                <h5 className="font-bold text-shapespire-green text-sm mb-2">{service.title}</h5>
                                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                    {service.items.map((item, i) => (
                                        <li key={i}>{item.description}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-16">
                    <div className="w-1/2">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-mono">{invoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">VAT (15%)</span>
                            <span className="font-mono">{invoice.vat.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-4 text-xl font-bold text-shapespire-green">
                            <span>Total Due</span>
                            <span>BDT {invoice.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p className="mb-2 font-bold">Thank you for your business!</p>
                    <p>Please include invoice number <strong>{invoice.id}</strong> on your payment.</p>
                    <p className="mt-4 text-xs">This is a computer-generated invoice compliant with Bangladesh VAT regulations.</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDocument;