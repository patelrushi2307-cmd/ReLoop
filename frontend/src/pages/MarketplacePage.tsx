import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { materialsApi } from '../features/materials/api';
import { Material } from '../features/materials/types';

export const MarketplacePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['materials', selectedCategory],
    queryFn: () => materialsApi.list({ materialType: selectedCategory || undefined }),
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Circular Materials Exchange</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Verified industrial surplus packaging lots ready for reallocation</p>
        </div>
        <Link
          to="/create-listing"
          style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
        >
          + List Packaging Lot
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['', 'cardboard', 'plastic', 'pallets'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              background: selectedCategory === cat ? '#10b981' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#374151',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat || 'All Materials'}
          </button>
        ))}
      </div>

      {isLoading && <p>Loading surplus packaging lots...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error loading marketplace inventory.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {data?.data?.map((material: Material) => (
          <div key={material._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              {material.materialType}
            </span>
            <h3 style={{ margin: '0.75rem 0 0.5rem', fontSize: '1.15rem' }}>{material.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.75rem' }}>
              Condition: <strong>{material.condition}</strong>
            </p>
            <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 1rem' }}>
              Quantity: <strong>{material.availableQuantity} {material.unit}</strong> available
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: material.isFreeClaim ? '#059669' : '#111827' }}>
                {material.isFreeClaim ? 'Free Circular Claim' : `$${material.pricePerUnit} / ${material.unit}`}
              </span>
              <Link to={`/materials/${material._id}`} style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                View Lot →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
