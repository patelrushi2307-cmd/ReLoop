import React from 'react';
import { Link } from 'react-router-dom';

export const MyListingsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Organization Inventory & Listings</h1>
        <Link
          to="/create-listing"
          style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
        >
          + New Listing
        </Link>
      </div>
      <p style={{ color: '#6b7280' }}>Manage surplus packaging lots posted by your organization.</p>
      <div style={{ border: '1px dashed #d1d5db', padding: '3rem', textAlign: 'center', borderRadius: '8px', marginTop: '1.5rem' }}>
        <p style={{ color: '#9ca3af' }}>Active listings for your verified facility will appear here.</p>
      </div>
    </div>
  );
};
