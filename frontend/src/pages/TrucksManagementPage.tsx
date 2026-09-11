import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Bell,
  Grid,
  MoreHorizontal,
  Plus,
  Minus,
  Maximize2,
  ExternalLink,
  Edit2,
  Trash2,
  Filter,
  Columns,
  Package,
  Sliders,
  Printer,
  Share2
} from 'lucide-react';
import './truck-dashboard.css';

interface CargoItem {
  id: string;
  code: string;
  weight: string;
  destination: string;
  row: number;
  col: number;
  isFilled: boolean;
}

interface LoadPlanRow {
  id: string;
  item: number;
  vehicle: string;
  seq: number;
  status: string;
}

export const TrucksManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Transportations');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedCargoId, setSelectedCargoId] = useState<string>('c-7');
  const [selectedShipment, setSelectedShipment] = useState('USA-146279BS-3');

  // Load planning rows state
  const [loadPlans, setLoadPlans] = useState<LoadPlanRow[]>([
    { id: '1', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
    { id: '2', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
    { id: '3', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
    { id: '4', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
    { id: '5', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
    { id: '6', item: 10, vehicle: 'D17_TRUCK 2', seq: 6, status: 'Planning' },
  ]);

  // Interactive cargo compartments grid inside semi-truck trailer
  const [cargoGrid, setCargoGrid] = useState<CargoItem[]>([
    { id: 'c-1', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 0, isFilled: true },
    { id: 'c-2', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 1, isFilled: true },
    { id: 'c-3', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 2, isFilled: true },
    { id: 'c-4', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 3, isFilled: true },
    { id: 'c-5', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 4, isFilled: true },
    { id: 'c-6', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 5, isFilled: true },
    { id: 'c-7', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 0, col: 6, isFilled: true },

    { id: 'c-8', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 0, isFilled: true },
    { id: 'c-9', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 1, isFilled: true },
    { id: 'c-10', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 2, isFilled: true },
    { id: 'c-11', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 3, isFilled: true },
    { id: 'c-12', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 4, isFilled: true },
    { id: 'c-13', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 5, isFilled: true },
    { id: 'c-14', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 1, col: 6, isFilled: true },

    { id: 'c-15', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 0, isFilled: true },
    { id: 'c-16', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 1, isFilled: true },
    { id: 'c-17', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 2, isFilled: true },
    { id: 'c-18', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 3, isFilled: true },
    { id: 'c-19', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 4, isFilled: true },
    { id: 'c-20', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 5, isFilled: true },
    { id: 'c-21', code: 'B2R', weight: '500 kg', destination: '2-NYK-LDN', row: 2, col: 6, isFilled: true },
  ]);

  const navItems = [
    'Home',
    'Transportations',
    'Freight Units',
    'Trucks',
    'Load Planing',
    'Load Distribution',
    'Info & Rates',
    'Settings',
  ];

  const shipments = [
    { id: 'USA-146279BS-1', code: 'USA-146279BS' },
    { id: 'USA-146279BS-2', code: 'USA-146279BS' },
    { id: 'USA-146279BS-3', code: 'USA-146279BS' },
    { id: 'USA-146279BS-4', code: 'USA-146279BS' },
    { id: 'USA-146279BS-5', code: 'USA-146279BS' },
  ];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));

  const handleCargoSelect = (id: string) => {
    setSelectedCargoId(id);
    setCargoGrid((prev) =>
      prev.map((cell) => (cell.id === id ? { ...cell, isFilled: true } : cell))
    );
  };

  const handleDeletePlan = (id: string) => {
    setLoadPlans((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddPlan = () => {
    const newId = String(Date.now());
    setLoadPlans((prev) => [
      ...prev,
      { id: newId, item: 10, vehicle: 'D17_TRUCK 2', seq: prev.length + 1, status: 'Planning' },
    ]);
  };

  return (
    <div className="truck-dashboard-container">
      {/* 1. Header Navigation Bar */}
      <header className="truck-navbar">
        <div className="truck-brand">
          <div className="truck-brand-logo">T</div>
          <span>Truck&Co</span>
        </div>

        <nav className="truck-nav-links">
          {navItems.map((item) => (
            <button
              key={item}
              className={`truck-nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="truck-nav-actions">
          <button className="icon-btn" title="Search">
            <Search size={18} />
          </button>
          <button className="icon-btn" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="icon-btn" title="Grid View">
            <Grid size={18} />
          </button>
          <div className="dispatcher-pill">
            <span>Lock</span>
            <span>Dispatcher: John Freightman</span>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="Dispatcher"
              className="dispatcher-avatar"
            />
          </div>
          <button className="btn-resent">Resent to driver</button>
          <button className="icon-btn" title="More">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* 2. Page Title Header & Metrics KPI Bar */}
      <section className="truck-header-section">
        <div className="truck-title-wrap">
          <button className="back-circle-btn" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
            <ChevronLeft size={20} />
          </button>
          <div className="truck-title-text">
            <h1>Trucks Management</h1>
            <p>This page shows recent dispatcher activity</p>
          </div>
        </div>

        <div className="truck-kpi-bar">
          <div className="kpi-item">
            <span className="kpi-label">Weight</span>
            <span className="kpi-value">7,340kg</span>
            <span className="kpi-badge green">+33%</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">Pallets</span>
            <span className="kpi-value">120</span>
            <span className="kpi-badge green">+15%</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-label">Alerts</span>
            <span className="kpi-value">62</span>
            <span className="kpi-badge purple">-22%</span>
          </div>
        </div>
      </section>

      {/* 3. Main Semi-Truck Stage & Interactive Cargo Grid */}
      <section className="truck-stage-container">
        {/* Left Zoom Toolbar */}
        <div className="zoom-controls">
          <button onClick={handleZoomIn} title="Zoom In">
            <Plus size={18} />
          </button>
          <hr />
          <button onClick={handleZoomOut} title="Zoom Out">
            <Minus size={18} />
          </button>
          <hr />
          <button onClick={() => setZoomLevel(1)} title="Fit View">
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Semi Truck & Trailer Diagram */}
        <div className="truck-graphic-wrapper" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}>
          <svg className="semi-truck-svg-container" viewBox="0 0 950 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* White Semi-Truck Cabin */}
            <path
              d="M40,240 L70,160 C85,130 115,120 160,120 L240,120 L270,150 L270,240 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="3"
            />
            {/* Cabin Windshield */}
            <path
              d="M170,135 L225,135 L245,170 L170,170 Z"
              fill="#1E293B"
            />
            {/* Cabin Details & Door */}
            <rect x="220" y="175" width="40" height="50" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="230" cy="200" r="3" fill="#475569" />

            {/* Front Wheels */}
            <circle cx="130" cy="250" r="24" fill="#1E293B" />
            <circle cx="130" cy="250" r="12" fill="#94A3B8" />
            <circle cx="310" cy="250" r="24" fill="#1E293B" />
            <circle cx="310" cy="250" r="12" fill="#94A3B8" />

            {/* Trailer Body Main Box */}
            <rect x="300" y="110" width="550" height="145" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
            
            {/* Trailer Undercarriage & Rear Wheels */}
            <rect x="300" y="250" width="550" height="8" fill="#475569" />
            <circle cx="710" cy="255" r="22" fill="#1E293B" />
            <circle cx="710" cy="255" r="10" fill="#94A3B8" />
            <circle cx="760" cy="255" r="22" fill="#1E293B" />
            <circle cx="760" cy="255" r="10" fill="#94A3B8" />
          </svg>

          {/* Interactive Cargo Compartments Overlay inside Trailer */}
          <div className="trailer-grid-overlay">
            {cargoGrid.map((cargo) => {
              const isSelected = selectedCargoId === cargo.id;
              return (
                <div
                  key={cargo.id}
                  className={`cargo-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCargoSelect(cargo.id)}
                >
                  {isSelected ? (
                    <div className="cargo-add-icon">+</div>
                  ) : (
                    <>
                      <span>{cargo.code}</span>
                      <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>{cargo.weight}</span>
                      <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>{cargo.destination}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Floating Load Planning Side Panel */}
        <aside className="load-planning-panel">
          <span className="panel-header-badge">C2-11_1</span>
          <div className="panel-header-title">
            <h3>Load Planning</h3>
            <button className="icon-btn" title="Expand">
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="panel-action-btns">
            <button className="btn-secondary-plan" onClick={() => setLoadPlans([])}>
              Remove Assignment
            </button>
            <button className="btn-primary-plan" onClick={handleAddPlan}>
              + Create New Plan
            </button>
            <button className="btn-secondary-plan" onClick={() => setLoadPlans([])}>
              Clear Plan
            </button>
          </div>

          <div className="panel-filter-bar">
            <button className="tiny-btn" title="Filter"><Filter size={12} /></button>
            <button className="tiny-btn" title="Columns"><Columns size={12} /></button>
            <button className="tiny-btn" title="Search"><Search size={12} /></button>
            <button className="tiny-btn" onClick={handleAddPlan} title="Add Row">+</button>
          </div>

          <table className="load-planning-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Vehicle</th>
                <th>Seq..</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadPlans.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Package size={12} color="#7c3aed" />
                      <span>{row.item}</span>
                    </div>
                  </td>
                  <td>{row.vehicle}</td>
                  <td>{row.seq}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button className="icon-btn" style={{ padding: 2 }} title="Edit">
                        <Edit2 size={12} />
                      </button>
                      <button className="icon-btn" style={{ padding: 2 }} onClick={() => handleDeletePlan(row.id)} title="Delete">
                        <Trash2 size={12} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </section>

      {/* 4. Shipment Unit Cards Carousel */}
      <section className="shipment-carousel-wrap">
        {shipments.map((s) => (
          <div
            key={s.id}
            className={`shipment-card ${selectedShipment === s.id ? 'active' : ''}`}
            onClick={() => setSelectedShipment(s.id)}
          >
            <div className="shipment-meta">
              <span>Shipment number</span>
              <strong>{s.code}</strong>
            </div>
            <svg className="mini-truck-icon" viewBox="0 0 60 30" fill="none">
              <rect x="20" y="5" width="35" height="18" rx="2" fill="#cbd5e1" />
              <path d="M5,15 L12,8 L20,8 L20,23 L5,23 Z" fill="#94a3b8" />
              <circle cx="15" cy="24" r="3" fill="#334155" />
              <circle cx="45" cy="24" r="3" fill="#334155" />
            </svg>
          </div>
        ))}
      </section>

      {/* 5. Bottom Split View - Freight Units & Interactive Gantt Timeline */}
      <section className="bottom-dashboard-grid">
        {/* Left Side: Freight Units List */}
        <div className="freight-units-card">
          <div className="freight-card-header">
            <h3>Freight Units</h3>
            <button className="dropdown-pill">Freight Orders ▾</button>
          </div>

          <div style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>00-00</span>
            <span>06-00</span>
            <span>12-00</span>
            <span>18-00</span>
          </div>

          {[
            { id: '6477715203', weight: '100kg' },
            { id: '6477715204', weight: '800kg' },
            { id: '6477715205', weight: '350kg' },
          ].map((item) => (
            <div key={item.id} className="freight-item-row">
              <div className="freight-item-left">
                <input type="checkbox" defaultChecked />
                <Package size={16} color="#7c3aed" />
                <span className="freight-code">{item.id}</span>
              </div>
              <span className="freight-weight">{item.weight}</span>
            </div>
          ))}
        </div>

        {/* Right Side: Interactive Gantt Chart Timeline Scheduler */}
        <div className="gantt-chart-card">
          <div className="gantt-header-bar">
            <div className="gantt-tabs">
              <button className="gantt-tab active">Gantt Chart</button>
              <button className="gantt-tab">Freight Orders ▾</button>
            </div>

            <div className="gantt-controls">
              <div className="slider-wrap">
                <Minus size={12} />
                <input type="range" min="1" max="100" defaultValue="50" style={{ width: 60 }} />
                <Plus size={12} />
              </div>
              <button className="icon-btn" title="Layout"><Sliders size={16} /></button>
              <button className="icon-btn" title="Print"><Printer size={16} /></button>
              <button className="icon-btn" title="Share"><Share2 size={16} /></button>
            </div>
          </div>

          {/* Timeline Dates Header */}
          <div className="gantt-timeline-container">
            <div className="gantt-timeline-header">
              {['Jun 14, 2024', '15, Jun', '16, Jun', '17, Jun'].map((date) => (
                <div key={date} className="date-col">
                  <div className="date-col-title">{date}</div>
                  <div className="time-ticks">
                    <span>00-00</span>
                    <span>06-00</span>
                    <span>12-00</span>
                    <span>18-00</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Bars Area */}
            <div className="gantt-grid-body">
              {/* Glowing vertical marker line for current time */}
              <div className="current-time-marker" title="Current Dispatch Marker (12-00)" />

              {/* Schedule Bar Row 1 */}
              <div className="gantt-bar-row">
                <div className="gantt-bar purple" style={{ left: '0%', width: '18%' }}>
                  SLO_MADRID
                </div>
                <div className="gantt-bar purple" style={{ left: '20%', width: '35%' }}>
                  6477715203
                </div>
                <div className="gantt-bar grey" style={{ left: '60%', width: '15%' }}>
                  SLO_BERLIN
                </div>
                <div className="gantt-bar grey" style={{ left: '78%', width: '18%' }}>
                  SLO_BERLIN
                </div>
              </div>

              {/* Schedule Bar Row 2 */}
              <div className="gantt-bar-row">
                <div className="gantt-bar purple" style={{ left: '0%', width: '10%' }}>
                  _MADRID
                </div>
                <div className="gantt-bar purple" style={{ left: '12%', width: '16%' }}>
                  6477715203
                </div>
                <div className="gantt-bar grey" style={{ left: '30%', width: '14%' }}>
                  SLO_BERLIN
                </div>
                <div className="gantt-bar grey" style={{ left: '46%', width: '12%' }}>
                  SLO_BERLIN
                </div>
                <div className="gantt-bar grey" style={{ left: '60%', width: '14%' }}>
                  6477715203
                </div>
                <div className="gantt-bar purple" style={{ left: '76%', width: '22%' }}>
                  SLO_BERLIN - 6477715203
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
