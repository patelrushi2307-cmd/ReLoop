import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Requirement, requirementsApi } from '../features/requirements/api';

const statusBadgeStyle: Record<string, React.CSSProperties> = {
  active: { backgroundColor: '#ecfdf3', color: '#027a48', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 },
  paused: { backgroundColor: '#fffaeb', color: '#b54708', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 },
  closed: { backgroundColor: '#f2f4f7', color: '#344054', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 },
};

export const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequirements = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const data = await requirementsApi.list(params);
      setRequirements(data.items);
    } catch (_err) {
      setError('Failed to load standing requirements. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [statusFilter]);

  return (
    <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#101828' }}>Standing Material Requirements</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#475467', fontSize: '0.95rem' }}>
            Post recurring demand needs so the exchange can match available packaging lots automatically.
          </p>
        </div>
        <Link
          to="/requirements/new"
          style={{
            backgroundColor: '#079455',
            color: '#ffffff',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          + Post Standing Need
        </Link>
      </header>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#344054', marginRight: '0.5rem' }}>Status:</span>
        {['', 'active', 'paused', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: statusFilter === status ? '2px solid #079455' : '1px solid #d0d5dd',
              backgroundColor: statusFilter === status ? '#ecfdf3' : '#ffffff',
              color: statusFilter === status ? '#027a48' : '#344054',
              fontWeight: statusFilter === status ? 700 : 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#667085' }}>
          <p>Loading standing requirements...</p>
        </div>
      )}

      {error && (
        <div role="alert" style={{ backgroundColor: '#fef3f2', border: '1px solid #fecdca', padding: '1rem', borderRadius: '8px', color: '#b42318', marginBottom: '1rem' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <button onClick={fetchRequirements} style={{ marginTop: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && requirements.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed #d0d5dd', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#101828' }}>No standing requirements found</h3>
          <p style={{ margin: 0, color: '#475467' }}>
            {statusFilter ? `No requirements with status '${statusFilter}'.` : 'You have not posted any material requirements yet.'}
          </p>
          <Link
            to="/requirements/new"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: '#079455',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create your first requirement &rarr;
          </Link>
        </div>
      )}

      {!loading && !error && requirements.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {requirements.map((req) => {
            const facilityName = typeof req.facilityId === 'object' && req.facilityId !== null ? req.facilityId.name : 'Intake Facility';
            return (
              <article
                key={req._id}
                style={{
                  border: '1px solid #eaecf0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
                  display: 'grid',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#101828' }}>
                      {req.materialSubtype.replace(/_/g, ' ')} ({req.materialCategory})
                    </h2>
                    <span style={statusBadgeStyle[req.status] || statusBadgeStyle.active}>
                      {req.status}
                    </span>
                  </div>
                  <Link
                    to={`/requirements/${req._id}`}
                    style={{ color: '#079455', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
                  >
                    View &amp; Manage &rarr;
                  </Link>
                </div>

                {req.description && (
                  <p style={{ margin: 0, color: '#475467', fontSize: '0.9rem' }}>
                    {req.description}
                  </p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: '#344054', marginTop: '0.25rem' }}>
                  <div>
                    <strong>Required Volume:</strong> {req.massKgPerPeriod.toLocaleString()} kg / {req.period}
                  </div>
                  <div>
                    <strong>Min Acceptable Grade:</strong> Grade {req.minGrade}
                  </div>
                  <div>
                    <strong>Price Ceiling:</strong> {req.maxPricePerKg !== undefined ? `$${req.maxPricePerKg.toFixed(2)} / kg` : 'Open / Uncapped'}
                  </div>
                  <div>
                    <strong>Feasibility:</strong>{' '}
                    {req.useCarbonLimit ? (
                      <span style={{ color: '#027a48', fontWeight: 600 }}>Carbon Feasibility (Dynamic)</span>
                    ) : (
                      <span>Max {req.maxDistanceKm} km radius</span>
                    )}
                  </div>
                  <div>
                    <strong>Facility:</strong> {facilityName}
                  </div>
                  <div>
                    <strong>Posted:</strong> {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};
