import React, { useState } from 'react';
import { logisticsApi, RouteEstimate } from '../features/logistics/api';

export const LogisticsPage: React.FC = () => {
  const [estimate, setEstimate] = useState<RouteEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateSampleRoute = async () => {
    setLoading(true);
    try {
      // Chicago to Milwaukee sample haul
      const res = await logisticsApi.getEstimate(-87.6298, 41.8781, -87.9065, 43.0389);
      setEstimate(res.data);
    } catch (_err) {
      alert('Error fetching logistics routing estimate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Logistics & Carrier Network</h1>
      <p style={{ color: '#6b7280' }}>Route verification, shipment quotes, and industrial pallet transport.</p>

      <div style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem' }}>
        <h3>Route & Haulage Estimator</h3>
        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          Calculates road distance, transit duration, and standard baseline freight cost between pickup yard and recycler facility.
        </p>
        <button
          onClick={handleCalculateSampleRoute}
          disabled={loading}
          style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Estimating...' : 'Run Sample Estimate (Chicago → Milwaukee)'}
        </button>

        {estimate && (
          <div style={{ marginTop: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '6px' }}>
            <p>Distance: <strong>{estimate.distanceKm} km</strong></p>
            <p>Estimated Travel Time: <strong>{estimate.durationMinutes} mins</strong></p>
            <p>Estimated Logistics Cost: <strong>${estimate.estimatedCost}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};
