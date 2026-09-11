import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <Link to="/orders" style={{ color: '#10b981', textDecoration: 'none' }}>← Back to Orders</Link>
      <div style={{ marginTop: '1rem', border: '1px solid #e5e7eb', padding: '2rem', borderRadius: '8px' }}>
        <h2>Transaction Record: {id}</h2>
        <p style={{ color: '#6b7280' }}>Details and custody verification status will appear here.</p>
      </div>
    </div>
  );
};
