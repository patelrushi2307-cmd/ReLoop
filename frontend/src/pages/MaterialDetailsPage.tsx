import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { materialsApi } from '../features/materials/api';

export const MaterialDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: () => materialsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading lot specifications...</div>;
  if (error || !data?.data) return <div style={{ padding: '2rem', color: '#ef4444' }}>Material listing not found.</div>;

  const item = data.data;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <Link to="/marketplace" style={{ color: '#10b981', textDecoration: 'none' }}>← Back to Marketplace</Link>
      <div style={{ marginTop: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem' }}>
        <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
          {item.materialType.toUpperCase()}
        </span>
        <h1 style={{ margin: '1rem 0 0.5rem' }}>{item.title}</h1>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{item.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', margin: '1.5rem 0', background: '#f9fafb', padding: '1rem', borderRadius: '6px' }}>
          <div><strong>Condition:</strong> {item.condition}</div>
          <div><strong>Available Quantity:</strong> {item.availableQuantity} {item.unit}</div>
          <div><strong>Listing Mode:</strong> {item.isFreeClaim ? 'Free Circular Claim' : `$${item.pricePerUnit} / ${item.unit}`}</div>
          <div><strong>Location:</strong> {item.pickupLocation?.city}</div>
        </div>

        <Link
          to={`/orders?materialId=${item._id}`}
          style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
        >
          {item.isFreeClaim ? 'Initiate Free Claim' : 'Place Order'}
        </Link>
      </div>
    </div>
  );
};
