import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SHAPESPIRE_INFO, BOISABI_INFO, PROJECT_SERVICES } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MOUDocument: React.FC = () => {
  const navigate = useNavigate();
  const [signed, setSigned] = useState(false);
  const [signDate, setSignDate] = useState<string>('');
  const [storedHash, setStoredHash] = useState<string>('');
  const [signerIP, setSignerIP] = useState<string>('');
  const [signerEmail, setSignerEmail] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  // Addendum State
  const [showAddendumModal, setShowAddendumModal] = useState(false);
  const [addendums, setAddendums] = useState<Array<{id: string, date: string, description: string, cost: string, timestamp: string}>>([]);
  const [newAddendum, setNewAddendum] = useState({ description: '', cost: '', date: new Date().toISOString().split('T')[0] });

  // Helper to generate SHA-256 hash
  const computeHash = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Function to get deterministic content of the contract for hashing
  const getContractContent = () => {
    // We serialize the critical data points that constitute the agreement
    return JSON.stringify({
      parties: [SHAPESPIRE_INFO, BOISABI_INFO],
      scope: PROJECT_SERVICES,
      agreementPeriod: { start: "2024-01-01", end: "2025-12-31" },
      paymentTerms: "Bank Transfer or SSLCommerz, 20% Advance",
      legalCompliance: "ICT Act 2006, Section 7",
      addendums: addendums // Include addendums in hash if they exist
    });
  };

  const handleSign = async () => {
    const email = window.prompt("Please enter your email address to digitally sign this document:");
    if (!email) return;
    setSignerEmail(email);

    // 1. Fetch IP (Simulate for now if API fails, but try to fetch)
    let ip = '192.168.1.1 (Simulated)';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (res.ok) {
            const data = await res.json();
            ip = data.ip;
        }
    } catch (e) {
        console.warn("Could not fetch IP, utilizing simulation fallback.");
    }
    setSignerIP(ip);

    // 2. Generate Hash
    const content = getContractContent();
    const hash = await computeHash(content);
    setStoredHash(hash);
    
    // Detailed Timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZoneName: 'short'
    });
    setSignDate(timestamp);
    setSigned(true);
  };

  const handleVerify = async () => {
    const currentContent = getContractContent();
    const currentHash = await computeHash(currentContent);
    
    if (currentHash === storedHash) {
      setVerificationStatus('success');
    } else {
      setVerificationStatus('failure');
    }
    
    // Reset status after 5 seconds
    setTimeout(() => setVerificationStatus('idle'), 5000);
  };

  const handleCreateAddendum = () => {
    if (!newAddendum.description) return;
    
    const now = new Date();
    const preciseTimestamp = now.toLocaleString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZoneName: 'short'
    });

    setAddendums([...addendums, {
      id: `ADD-${new Date().getFullYear()}-${String(addendums.length + 1).padStart(3, '0')}`,
      date: newAddendum.date,
      description: newAddendum.description,
      cost: newAddendum.cost,
      timestamp: preciseTimestamp
    }]);
    
    // Reset form and close modal
    setNewAddendum({ description: '', cost: '', date: new Date().toISOString().split('T')[0] });
    setShowAddendumModal(false);
    
    // Warn but do not invalidate immediately to allow demonstration of Integrity Compromised check
    if (signed) {
        alert("Warning: You have modified a signed document. The digital signature hash will no longer match the document content.");
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById('mou-content');
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ShapeSpire-Boisabi-MOU.pdf');
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen relative">
      <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-4 no-print flex-wrap">
        <button 
          onClick={() => setShowAddendumModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 shadow-sm"
        >
          <span>📝</span> Generate Addendum
        </button>
        <button 
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          <span>💳</span> Make Payment
        </button>
        <button 
          onClick={window.print}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2 shadow-sm"
        >
          <span>🖨️</span> Print
        </button>
        <button 
          onClick={downloadPDF}
          className="px-4 py-2 bg-shapespire-gold text-white rounded hover:bg-yellow-600 flex items-center gap-2 shadow-sm"
        >
          <span>📄</span> Download PDF
        </button>
      </div>

      <div id="mou-content" className="bg-white p-12 shadow-2xl max-w-4xl mx-auto text-gray-800 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b-2 border-shapespire-green pb-6">
            <div className="flex items-center gap-4">
                <img src={SHAPESPIRE_INFO.logo} alt="ShapeSpire Logo" className="w-20 h-20 object-contain rounded-md" />
                <div>
                    <h1 className="text-xl font-bold text-shapespire-green uppercase tracking-wider">{SHAPESPIRE_INFO.name}</h1>
                    <p className="text-xs text-gray-500">Architecting Tomorrow</p>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-gray-900">MEMORANDUM OF UNDERSTANDING</h2>
                <p className="text-sm text-gray-500 mt-1">Ref: SS-BR-2024-001</p>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <h1 className="text-xl font-bold text-red-700 uppercase tracking-wider">{BOISABI_INFO.name}</h1>
                    <p className="text-xs text-gray-500">The Exotic Journey</p>
                </div>
                <img src={BOISABI_INFO.logo} alt="Boisabi Logo" className="w-20 h-20 object-contain rounded-md" />
            </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="bg-gray-50 p-6 border-l-4 border-shapespire-green shadow-sm">
                <h3 className="font-bold text-shapespire-green mb-3 uppercase text-sm">First Party</h3>
                <p className="font-bold text-lg">{SHAPESPIRE_INFO.name}</p>
                <p className="text-sm mt-1"><span className="font-semibold">Rep:</span> {SHAPESPIRE_INFO.founder}</p>
                <p className="text-sm text-gray-600 mt-2">{SHAPESPIRE_INFO.address}</p>
                <p className="text-sm text-gray-600">{SHAPESPIRE_INFO.contact}</p>
            </div>
            <div className="bg-gray-50 p-6 border-l-4 border-red-700 shadow-sm">
                <h3 className="font-bold text-red-700 mb-3 uppercase text-sm">Second Party</h3>
                <p className="font-bold text-lg">{BOISABI_INFO.name}</p>
                <p className="text-sm mt-1"><span className="font-semibold">Location:</span> {BOISABI_INFO.location}</p>
                <p className="text-sm text-gray-600 mt-2">{BOISABI_INFO.facilities}</p>
                <p className="text-sm text-gray-600">{BOISABI_INFO.contact}</p>
            </div>
        </div>

        {/* Agreement Period */}
        <div className="mb-10">
            <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4">1. Agreement Period</h3>
            <p className="text-justify leading-relaxed">
                This agreement is valid for a period of <span className="font-bold">2 (Two) Years</span> starting from <span className="font-bold">January 1, 2024</span> to <span className="font-bold">December 31, 2025</span>. Both parties may renew this agreement upon mutual written consent.
            </p>
        </div>

        {/* Scope - Updated to Table format */}
        <div className="mb-10">
            <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4">2. Scope of Services & Fee Structure</h3>
            <div className="space-y-8">
                {PROJECT_SERVICES.map((section, index) => (
                    <div key={index}>
                        <h4 className="font-bold text-shapespire-green mb-3 text-md pb-2">
                           {index + 1}. {section.title}
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-200 font-semibold text-gray-700 w-1/2">Service Description</th>
                                        <th className="py-2 px-4 border border-gray-200 font-semibold text-gray-700 w-1/4">Timeline</th>
                                        <th className="py-2 px-4 border border-gray-200 font-semibold text-gray-700 w-1/4 text-right">Fees (BDT)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.items.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border border-gray-200 text-gray-700 align-top">{item.description}</td>
                                            <td className="py-2 px-4 border border-gray-200 text-gray-600 align-top">{item.timeline}</td>
                                            <td className="py-2 px-4 border border-gray-200 text-gray-600 text-right font-mono align-top">{item.fee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-10">
             <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4">3. Payment Terms</h3>
             <ul className="list-disc list-inside space-y-2 mb-4">
                 <li>All payments shall be made in BDT via Bank Transfer or SSLCommerz Gateway.</li>
                 <li>A mobilization advance of 20% is required prior to commencement.</li>
                 <li>Subsequent payments are tied to milestone completion as defined in Schedule A.</li>
             </ul>
        </div>

        {/* Addendums Section */}
        {addendums.length > 0 && (
            <div className="mb-10">
                <h3 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4 text-purple-700">4. Addendums & Amendments</h3>
                <div className="space-y-4">
                    {addendums.map((addendum, idx) => (
                        <div key={idx} className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-purple-900">{addendum.id}: Amendment</h4>
                                <span className="text-xs text-gray-500 font-mono">Effective: {addendum.date}</span>
                            </div>
                            <p className="text-sm text-gray-800 mb-2 font-semibold">Scope Change / Description:</p>
                            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{addendum.description}</p>
                            {addendum.cost && (
                                <div className="text-sm mb-3">
                                    <span className="font-bold text-gray-600">Cost Adjustment: </span>
                                    <span className="font-mono">{addendum.cost} BDT</span>
                                </div>
                            )}
                            <div className="mt-4 pt-2 border-t border-purple-200">
                                <div className="flex flex-col gap-1 text-[10px] text-gray-500 font-mono bg-purple-100/50 p-2 rounded">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">GENERATION AUDIT:</span>
                                        <span>{addendum.timestamp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">INITIATED BY:</span>
                                        <span>SYSTEM ADMIN ({SHAPESPIRE_INFO.founder})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Legal */}
        <div className="mb-12 bg-gray-50 p-6 rounded text-sm text-gray-600">
            <h4 className="font-bold text-gray-800 mb-2">Legal Compliance</h4>
            <p>
                This agreement constitutes a legally binding electronic contract under the <span className="font-bold">Information and Communication Technology Act, 2006 (Bangladesh)</span>, Section 7.
                By signing below, both parties acknowledge the legal validity of digital signatures and electronic records.
            </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-20 mt-24 pt-4 mb-8">
            {/* ShapeSpire Signature */}
            <div className="text-center relative">
                {signed && (
                   <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center">
                       {/* Prominent Ink-like Signature */}
                       <div className="font-signature text-6xl text-blue-900 transform -rotate-6 opacity-95 pb-2 min-w-[300px]" style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.05))' }}>
                           {SHAPESPIRE_INFO.founder}
                       </div>
                   </div> 
                )}
                <div className="border-t-2 border-gray-800 pt-4 relative z-10">
                    <p className="font-bold text-lg text-gray-900 leading-tight">{SHAPESPIRE_INFO.founder}</p>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Founder & CEO</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{SHAPESPIRE_INFO.name}</p>
                    {signed && <p className="text-[10px] text-gray-400 mt-2 font-mono">Digitally Signed: {signDate}</p>}
                </div>
            </div>

            {/* Boisabi Signature */}
            <div className="text-center relative">
                 <div className="border-t-2 border-gray-800 pt-4 mt-0 relative z-10">
                    <p className="font-bold text-lg text-gray-900 leading-tight">Authorized Signatory</p>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mt-1">Managing Director</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{BOISABI_INFO.name}</p>
                    <div className="mt-8">
                         {!signed ? (
                             <button 
                                onClick={handleSign} 
                                className="mx-auto bg-shapespire-green text-white px-8 py-3 rounded shadow-lg hover:bg-green-800 text-sm no-print font-bold transition-all transform hover:scale-105 flex items-center gap-2"
                             >
                                 <span>✍️</span> Sign Document
                             </button>
                         ) : (
                             <div className="mt-2 inline-block px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-400 text-xs font-bold uppercase tracking-widest">
                                 Counter-Signature Pending
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* Audit Trail & Verification */}
        {signed && (
            <div className="mt-16 bg-slate-50 border border-slate-200 rounded-lg p-6 text-xs text-gray-500 font-mono">
                <h5 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4 text-sm flex items-center gap-2">
                    <span>🔐</span> DIGITAL SIGNATURE AUDIT TRAIL
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                            <span className="font-bold text-gray-400">DOCUMENT HASH:</span>
                            <span className="break-all font-mono bg-white p-1 rounded border border-gray-100">{storedHash}</span>
                            
                            <span className="font-bold text-gray-400">TIMESTAMP:</span>
                            <span>{signDate}</span>
                            
                            <span className="font-bold text-gray-400">IP ADDRESS:</span>
                            <span>{signerIP}</span>
                            
                            <span className="font-bold text-gray-400">SIGNER ID:</span>
                            <span>{SHAPESPIRE_INFO.founder} &lt;{signerEmail}&gt;</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-center border-l border-gray-200 pl-8">
                         <div className="mb-3 min-h-[24px]">
                             {verificationStatus === 'success' && (
                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-bold border border-green-200 shadow-sm animate-pulse">
                                    ✅ Integrity Verified
                                </span>
                            )}
                            {verificationStatus === 'failure' && (
                                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-bold border border-red-200 shadow-sm animate-pulse">
                                    ❌ Integrity Compromised
                                </span>
                            )}
                         </div>
                        <button 
                            onClick={handleVerify}
                            disabled={verificationStatus !== 'idle'}
                            className={`px-6 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                                verificationStatus === 'idle' 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                           <span>🛡️</span> 
                           {verificationStatus === 'idle' ? 'Recalculate Hash' : 'Verifying...'}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-2 text-center max-w-[200px]">
                            Recomputes SHA-256 hash of current document content to verify it matches the stored signature.
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Addendum Modal */}
      {showAddendumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Generate MOU Addendum</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                          <input 
                              type="date" 
                              value={newAddendum.date}
                              onChange={(e) => setNewAddendum({...newAddendum, date: e.target.value})}
                              className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scope Changes / Description</label>
                          <textarea 
                              value={newAddendum.description}
                              onChange={(e) => setNewAddendum({...newAddendum, description: e.target.value})}
                              placeholder="Describe the new scope items, modifications to existing terms, or additional requirements..."
                              className="w-full border rounded p-2 text-sm h-32 focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Adjustment (BDT)</label>
                          <input 
                              type="text" 
                              value={newAddendum.cost}
                              onChange={(e) => setNewAddendum({...newAddendum, cost: e.target.value})}
                              placeholder="e.g. 500,000 (Optional)"
                              className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                      </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                      <button 
                          onClick={() => setShowAddendumModal(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-sm"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleCreateAddendum}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium text-sm shadow"
                      >
                          Create Addendum
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MOUDocument;