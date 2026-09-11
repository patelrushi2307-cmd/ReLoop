import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#111827' }}>Partner Operations Portal</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Welcome, {user?.name} ({user?.role})</p>
        </div>
        <button
          onClick={logout}
          style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>Marketplace</h3>
            <p style={{ color: '#6b7280' }}>Discover and claim surplus cardboard, plastic, and pallets.</p>
          </div>
        </Link>
        <Link to="/create-listing" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>Post Material Listing</h3>
            <p style={{ color: '#6b7280' }}>List surplus packaging lots for reuse or certified recycling.</p>
          </div>
        </Link>
        <Link to="/my-listings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>My Material Listings</h3>
            <p style={{ color: '#6b7280' }}>Manage active inventory and allocation statuses.</p>
          </div>
        </Link>
        <Link to="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>Orders & Claims</h3>
            <p style={{ color: '#6b7280' }}>Track inbound and outbound material transactions.</p>
          </div>
        </Link>
        <Link to="/trucks-management" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '2px solid #7c3aed', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer', background: '#fcfaff' }}>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem' }}>🚚 Trucks Management</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Interactive trailer load planning, dispatcher activity & Gantt chart.</p>
          </div>
        </Link>
        <Link to="/logistics" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>Logistics & Routing</h3>
            <p style={{ color: '#6b7280' }}>Estimate hauling distances, costs, and scheduled pickups.</p>
          </div>
        </Link>
        <Link to="/impact" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <h3>Impact & ESG Metrics</h3>
            <p style={{ color: '#6b7280' }}>View packaging diverted and carbon avoidance metrics.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
