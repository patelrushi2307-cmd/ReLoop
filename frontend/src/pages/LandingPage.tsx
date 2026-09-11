import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#065f46', marginBottom: '0.5rem' }}>
          Circular Packaging & Materials Exchange
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>
          B2B Industrial Marketplace for Surplus & Reusable Packaging (Cardboard, Plastic, Pallets)
        </p>
      </header>

      <section style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <Link
          to="/marketplace"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600,
          }}
        >
          Browse Marketplace
        </Link>
        <Link
          to="/login"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #10b981',
            color: '#10b981',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600,
          }}
        >
          Partner Sign In
        </Link>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#111827' }}>📦 Cardboard & OCC</h3>
          <p style={{ color: '#6b7280' }}>Corrugated boxes, sheets, and baled salvage for secondary remanufacturing.</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#111827' }}>♻️ Polymers & Film</h3>
          <p style={{ color: '#6b7280' }}>LDPE wrap, HDPE rigid containers, and industrial returnable transit packaging.</p>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#111827' }}>🪵 Standard & Euro Pallets</h3>
          <p style={{ color: '#6b7280' }}>Wooden and composite pallets kept in continuous supply chain circulation.</p>
        </div>
      </div>
    </div>
  );
};
