import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Requirement, requirementsApi } from '../features/requirements/api';

const statusBadgeStyle: Record<string, React.CSSProperties> = {
  active: { backgroundColor: '#ecfdf3', color: '#027a48', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 },
  paused: { backgroundColor: '#fffaeb', color: '#b54708', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 },
  closed: { backgroundColor: '#f2f4f7', color: '#344054', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 },
};

export const RequirementDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editMass, setEditMass] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDistance, setEditDistance] = useState('');

  const fetchRequirement = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await requirementsApi.getById(id);
      setRequirement(data);
      setEditDescription(data.description || '');
      setEditMass(data.massKgPerPeriod.toString());
      setEditPrice(data.maxPricePerKg !== undefined ? data.maxPricePerKg.toString() : '');
      setEditDistance(data.maxDistanceKm !== undefined ? data.maxDistanceKm.toString() : '');
    } catch (_err) {
      setError('Failed to load requirement details or resource not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirement();
  }, [id]);

  const handlePause = async () => {
    if (!id) return;
    setActionLoading(true);
    setError('');
    try {
      const updated = await requirementsApi.pause(id);
      setRequirement(updated);
      setSuccessMessage('Requirement paused successfully.');
    } catch (err) {
      setError('Failed to pause requirement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!id) return;
    setActionLoading(true);
    setError('');
    try {
      const updated = await requirementsApi.resume(id);
      setRequirement(updated);
      setSuccessMessage('Requirement resumed to active standing status.');
    } catch (err) {
      setError('Failed to resume requirement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!id || !window.confirm('Are you sure you want to close this requirement? Closed requirements cannot be reactivated.')) return;
    setActionLoading(true);
    setError('');
    try {
      const updated = await requirementsApi.close(id);
      setRequirement(updated);
      setSuccessMessage('Requirement closed permanently.');
    } catch (err) {
      setError('Failed to close requirement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setActionLoading(true);
    setError('');
    try {
      const massNum = Number(editMass);
      if (isNaN(massNum) || massNum <= 0) throw new Error('Mass per period must be positive.');

      const updated = await requirementsApi.update(id, {
        description: editDescription.trim() || undefined,
        massKgPerPeriod: massNum,
        maxPricePerKg: editPrice ? Number(editPrice) : undefined,
        maxDistanceKm: !requirement?.useCarbonLimit && editDistance ? Number(editDistance) : undefined,
      });

      setRequirement(updated);
      setIsEditing(false);
      setSuccessMessage('Requirement updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update requirement.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center', color: '#667085' }}>
        <p>Loading requirement...</p>
      </main>
    );
  }

  if (error && !requirement) {
    return (
      <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
        <div role="alert" style={{ backgroundColor: '#fef3f2', border: '1px solid #fecdca', padding: '1.25rem', borderRadius: '8px', color: '#b42318' }}>
          <h3>Unable to load requirement</h3>
          <p>{error}</p>
          <Link to="/requirements" style={{ color: '#b42318', fontWeight: 600 }}>&larr; Back to Requirements</Link>
        </div>
      </main>
    );
  }

  if (!requirement) return null;

  const facilityName = typeof requirement.facilityId === 'object' && requirement.facilityId !== null
    ? requirement.facilityId.name
    : 'Intake Facility';

  return (
    <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/requirements" style={{ color: '#079455', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          &larr; Back to Standing Requirements
        </Link>
      </nav>

      {successMessage && (
        <div style={{ backgroundColor: '#ecfdf3', border: '1px solid #a6f4c5', padding: '0.75rem 1rem', borderRadius: '8px', color: '#027a48', marginBottom: '1rem' }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div role="alert" style={{ backgroundColor: '#fef3f2', border: '1px solid #fecdca', padding: '0.75rem 1rem', borderRadius: '8px', color: '#b42318', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Main Requirement Card */}
      <div style={{ border: '1px solid #eaecf0', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f2f4f7', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#475467', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Standing Requirement
            </span>
            <h1 style={{ margin: '0.25rem 0', fontSize: '1.6rem', color: '#101828' }}>
              {requirement.materialSubtype.replace(/_/g, ' ')} ({requirement.materialCategory})
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#667085' }}>
              Created on {new Date(requirement.createdAt).toLocaleDateString()} · ID: {requirement._id}
            </p>
          </div>
          <span style={statusBadgeStyle[requirement.status] || statusBadgeStyle.active}>
            {requirement.status.toUpperCase()}
          </span>
        </div>

        {/* View / Edit Mode */}
        {!isEditing ? (
          <div style={{ marginTop: '1.25rem', display: 'grid', gap: '1.25rem' }}>
            {requirement.description && (
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#344054', display: 'block', marginBottom: '0.25rem' }}>Description &amp; Processing Specs</strong>
                <p style={{ margin: 0, color: '#101828', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {requirement.description}
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#667085', display: 'block' }}>Required Volume</span>
                <strong style={{ fontSize: '1.05rem', color: '#101828' }}>
                  {requirement.massKgPerPeriod.toLocaleString()} kg / {requirement.period}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#667085', display: 'block' }}>Minimum Acceptable Quality</span>
                <strong style={{ fontSize: '1.05rem', color: '#101828' }}>
                  Grade {requirement.minGrade}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#667085', display: 'block' }}>Price Ceiling</span>
                <strong style={{ fontSize: '1.05rem', color: '#101828' }}>
                  {requirement.maxPricePerKg !== undefined ? `$${requirement.maxPricePerKg.toFixed(2)} / kg` : 'Uncapped'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#667085', display: 'block' }}>Sourcing Feasibility</span>
                {requirement.useCarbonLimit ? (
                  <strong style={{ color: '#027a48' }}>Carbon Feasibility (Dynamic)</strong>
                ) : (
                  <strong style={{ color: '#101828' }}>Max {requirement.maxDistanceKm} km haul</strong>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#667085', display: 'block' }}>Delivery Facility</span>
                <strong style={{ fontSize: '1.05rem', color: '#101828' }}>
                  {facilityName}
                </strong>
              </div>
            </div>

            {/* Lifecycle & Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {requirement.status === 'active' && (
                <button
                  onClick={handlePause}
                  disabled={actionLoading}
                  style={{ backgroundColor: '#fef0c7', color: '#b54708', border: '1px solid #fedf89', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Pause Requirement
                </button>
              )}

              {requirement.status === 'paused' && (
                <button
                  onClick={handleResume}
                  disabled={actionLoading}
                  style={{ backgroundColor: '#ecfdf3', color: '#027a48', border: '1px solid #a6f4c5', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Resume Requirement
                </button>
              )}

              {requirement.status !== 'closed' && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={actionLoading}
                    style={{ backgroundColor: '#ffffff', color: '#344054', border: '1px solid #d0d5dd', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Edit Specifications
                  </button>

                  <button
                    onClick={handleClose}
                    disabled={actionLoading}
                    style={{ backgroundColor: '#ffffff', color: '#b42318', border: '1px solid #fecdca', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close Requirement
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSaveEdit} style={{ marginTop: '1.25rem', display: 'grid', gap: '1rem' }}>
            <label>
              <strong style={{ fontSize: '0.85rem', color: '#344054' }}>Description</strong>
              <textarea
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d5dd', marginTop: '0.25rem' }}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label>
                <strong style={{ fontSize: '0.85rem', color: '#344054' }}>Required Volume (kg / {requirement.period})</strong>
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d5dd', marginTop: '0.25rem' }}
                  value={editMass}
                  onChange={(e) => setEditMass(e.target.value)}
                  required
                />
              </label>

              <label>
                <strong style={{ fontSize: '0.85rem', color: '#344054' }}>Max Price ($/kg)</strong>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d5dd', marginTop: '0.25rem' }}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </label>
            </div>

            {!requirement.useCarbonLimit && (
              <label>
                <strong style={{ fontSize: '0.85rem', color: '#344054' }}>Max Distance (km)</strong>
                <input
                  type="number"
                  min="1"
                  max="20000"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d5dd', marginTop: '0.25rem' }}
                  value={editDistance}
                  onChange={(e) => setEditDistance(e.target.value)}
                  required
                />
              </label>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={actionLoading}
                style={{ backgroundColor: '#079455', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={actionLoading}
                style={{ backgroundColor: '#ffffff', color: '#344054', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d0d5dd', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};
