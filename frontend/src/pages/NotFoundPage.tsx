import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '3rem', color: '#374151' }}>404</h1>
      <p style={{ color: '#6b7280', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        The requested resource or exchange endpoint does not exist.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.6rem 1.2rem',
          background: '#10b981',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 600,
        }}
      >
        Return to Home
      </Link>
    </div>
  );
};
