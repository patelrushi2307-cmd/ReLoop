import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { impactApi } from '../features/impact/api';

export const ImpactDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const orgId = typeof user?.organizationId === 'object' && user.organizationId ? user.organizationId._id : (user?.organizationId as string | undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['impact', orgId],
    queryFn: () => impactApi.getSummary(orgId!),
    enabled: !!orgId,
  });

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Circular Sustainability & ESG Impact</h1>
      <p style={{ color: '#6b7280' }}>Verified diversion from landfill and carbon emissions avoided.</p>

      {isLoading ? (
        <p>Calculating impact...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ border: '1px solid #10b981', background: '#ecfdf5', padding: '1.5rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#047857' }}>Waste Diverted</span>
            <h2 style={{ color: '#065f46', margin: '0.5rem 0' }}>{data?.data?.wasteDivertedKg ?? 0} kg</h2>
            <p style={{ fontSize: '0.8rem', color: '#065f46', margin: 0 }}>Kept in high-value circular reuse</p>
          </div>
          <div style={{ border: '1px solid #3b82f6', background: '#eff6ff', padding: '1.5rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>CO₂ Emissions Avoided</span>
            <h2 style={{ color: '#1e40af', margin: '0.5rem 0' }}>{data?.data?.co2SavedKg ?? 0} kg CO₂e</h2>
            <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0 }}>Compared to virgin packaging production</p>
          </div>
          <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed Transfers</span>
            <h2 style={{ color: '#111827', margin: '0.5rem 0' }}>{data?.data?.completedTransactions ?? 0}</h2>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Verified chain-of-custody transfers</p>
          </div>
        </div>
      )}
    </div>
  );
};
