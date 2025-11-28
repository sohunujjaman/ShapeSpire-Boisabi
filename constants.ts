import { ScopeItem, PaymentMilestone, Invoice } from './types';

export const SHAPESPIRE_INFO = {
  name: "ShapeSpire Architects",
  founder: "Ar. Md. Sohanujjaman Sohan",
  address: "House 12, Road 4, Banani, Dhaka, Bangladesh",
  contact: "+880 1711 000000 | contact@shapespire.com",
  logo: "https://placehold.co/200x200/2F5233/D4AF37?text=ShapeSpire" 
};

export const BOISABI_INFO = {
  name: "Boisabi Resort",
  description: "3-Star Resort",
  location: "Bamu, Bandarban Hill District, Bangladesh",
  facilities: "Duplex Accommodations, Double Rooms, Swimming Pool",
  contact: "Manager | info@boisabiresort.com",
  logo: "https://placehold.co/200x200/000000/FF0000?text=Boisabi" 
};

export const PROJECT_SERVICES = [
  {
    title: "Architectural & Engineering Scope of Work",
    items: [
      { description: "Landscape Design: Development of outdoor terrain and green spaces.", timeline: "Q1 2024", fee: "1,200,000" },
      { description: "Entry Gate: Architectural design and construction.", timeline: "Q1 2024", fee: "800,000" },
      { description: "Hospitality & Dining Structures: Kitchen & Restaurant facility, Dining Shed (Outdoor/Semi-outdoor).", timeline: "Q2 2024", fee: "2,500,000" },
      { description: "Accommodation Units: A-Frame Style Cottage, Duplex Cottage, Triplex Cottage.", timeline: "Q2-Q3 2024", fee: "5,000,000" },
      { description: "Recreation & Leisure Zones: Boithokkhana (Lounge), Dolna (Swing area), Tree House.", timeline: "Q3 2024", fee: "1,500,000" },
      { description: "Installations: Physical Photo Frame for guest photography.", timeline: "Q3 2024", fee: "200,000" }
    ]
  },
  {
    title: "Brand Design, Strategy & Implementation",
    items: [
      { description: "Brand Identity Development: Logo design, visual style guide, brand voice & messaging.", timeline: "Q1 2024", fee: "300,000" },
      { description: "Strategic Planning: Market positioning, target audience analysis, CX mapping.", timeline: "Q1 2024", fee: "200,000" },
      { description: "Collateral Implementation: Signage & Wayfinding, Staff uniforms & merchandise, Menu & Guidebook design.", timeline: "Q2 2024", fee: "400,000" }
    ]
  },
  {
    title: "Digital Marketing & Content Creation",
    items: [
      { description: "Catalogue & Brochure Design: Day Trip Packages, Monthly Events, Project Overview.", timeline: "Ongoing", fee: "150,000" },
      { description: "Video Production: Day Trip Promos, Event Coverage, Facility Walkthroughs.", timeline: "Monthly", fee: "500,000" },
      { description: "Social Media Marketing (SMM): Content calendar, community management, influencer outreach.", timeline: "Monthly", fee: "50,000/mo" },
      { description: "Digital Tools: Website Development, Email Marketing, Google Forms integration.", timeline: "Q1 2024", fee: "300,000" }
    ]
  }
];

export const MOCK_SCOPE_ITEMS: ScopeItem[] = [
  { id: '1', description: 'Main Reception Renovation', category: 'Renovation', timeline: 'Q1 2024', cost: 1500000, status: 'Approved_By_Client' },
  { id: '2', description: 'Swimming Pool Maintenance System', category: 'Maintenance', timeline: 'Q1 2024', cost: 500000, status: 'Completed' },
  { id: '3', description: 'New Duplex Design Phase', category: 'Design', timeline: 'Q2 2024', cost: 800000, status: 'In_Progress' },
  { id: '4', description: 'Landscape Architecture', category: 'Construction', timeline: 'Q3 2024', cost: 2000000, status: 'Pending' },
];

export const MOCK_MILESTONES: PaymentMilestone[] = [
  { id: 'm1', description: 'Mobilization Advance (20%)', amount: 960000, dueDate: '2024-01-15', status: 'Paid' },
  { id: 'm2', description: 'Design Completion (Phase 1)', amount: 800000, dueDate: '2024-03-30', status: 'Pending' },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-01-001',
    date: '2024-01-01',
    dueDate: '2024-01-31',
    milestoneId: 'm1',
    items: [
        { id: '101', description: 'Architectural & Engineering Services (Initial Phase)', category: 'Construction', timeline: '2024', cost: 250000, status: 'Approved_By_Client' },
        { id: '102', description: 'Brand Strategy & Identity Development', category: 'Design', timeline: '2024', cost: 150000, status: 'Approved_By_Client' },
        { id: '103', description: 'Digital Marketing Setup & Content Creation', category: 'Design', timeline: '2024', cost: 100000, status: 'Approved_By_Client' }
    ], 
    subtotal: 500000,
    vat: 75000,
    total: 575000,
    status: 'PAID'
  }
];