import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { organizationsApi } from '../features/organizations/api';
import { requirementsApi, RequirementGrade, RequirementPeriod } from '../features/requirements/api';

const inputStyle = { width: '100%', padding: '0.6rem', marginTop: '0.25rem', boxSizing: 'border-box' as const, borderRadius: '6px', border: '1px solid #d0d5dd', fontSize: '0.95rem' };

const TAXONOMY: Record<string, string[]> = {
  cardboard: ['corrugated_cardboard', 'occ', 'die_cut_box'],
  plastics: ['stretch_film', 'strapping', 'rigid_container'],
  pallets: ['wooden_pallet', 'plastic_pallet', 'euro_pallet'],
  drums: ['steel_drum', 'plastic_drum'],
  gaylords: ['fiber_gaylord', 'plastic_gaylord'],
};

export const CreateRequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Array<{ _id: string; name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    facilityId: '',
    materialCategory: 'cardboard',
    materialSubtype: 'corrugated_cardboard',
    description: '',
    minGrade: 'B' as RequirementGrade,
    massKgPerPeriod: '3000',
    period: 'weekly' as RequirementPeriod,
    maxPricePerKg: '',
    useCarbonLimit: false,
    maxDistanceKm: '150',
  });

  useEffect(() => {
    organizationsApi.getMe()
      .then((org) => {
        setFacilities(org.facilities);
        if (org.facilities && org.facilities[0]) {
          setForm((f) => ({ ...f, facilityId: org.facilities[0]._id }));
        }
      })
      .catch(() => setError('Unable to load facilities. Please ensure you are logged in.'));
  }, []);

  const handleCategoryChange = (category: string) => {
    const subtypes = TAXONOMY[category] || [];
    setForm((f) => ({
      ...f,
      materialCategory: category,
      materialSubtype: subtypes[0] || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const mass = Number(form.massKgPerPeriod);
      if (isNaN(mass) || mass <= 0) {
        throw new Error('Mass per period must be a positive number.');
      }

      if (!form.useCarbonLimit) {
        const dist = Number(form.maxDistanceKm);
        if (isNaN(dist) || dist <= 0) {
          throw new Error('Maximum haul distance must be provided when carbon optimization is not selected.');
        }
      }

      await requirementsApi.create({
        facilityId: form.facilityId,
        materialCategory: form.materialCategory,
        materialSubtype: form.materialSubtype,
        description: form.description.trim() || undefined,
        minGrade: form.minGrade,
        massKgPerPeriod: mass,
        period: form.period,
        maxPricePerKg: form.maxPricePerKg ? Number(form.maxPricePerKg) : undefined,
        useCarbonLimit: form.useCarbonLimit,
        maxDistanceKm: !form.useCarbonLimit && form.maxDistanceKm ? Number(form.maxDistanceKm) : undefined,
      });

      navigate('/requirements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post requirement. Please check the required fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/requirements" style={{ color: '#079455', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          &larr; Back to Standing Requirements
        </Link>
      </nav>

      <h1 style={{ margin: '0 0 0.5rem 0', color: '#101828' }}>Post Standing Material Requirement</h1>
      <p style={{ margin: '0 0 1.5rem 0', color: '#475467' }}>
        Define recurring material specifications for your facilities. As matching circular supply lots are listed, you will receive recommendations automatically.
      </p>

      {error && (
        <div role="alert" style={{ backgroundColor: '#fef3f2', border: '1px solid #fecdca', padding: '0.75rem 1rem', borderRadius: '8px', color: '#b42318', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
        {/* Facility */}
        <label>
          <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Intake Delivery Facility *</strong>
          <select
            style={inputStyle}
            value={form.facilityId}
            onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
            required
          >
            <option value="">Select a facility</option>
            {facilities.map((fac) => (
              <option key={fac._id} value={fac._id}>
                {fac.name}
              </option>
            ))}
          </select>
        </label>

        {/* Category & Subtype */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Material Category *</strong>
            <select
              style={inputStyle}
              value={form.materialCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              <option value="cardboard">Cardboard &amp; Fiber</option>
              <option value="plastics">Plastics &amp; Polymers</option>
              <option value="pallets">Pallets &amp; Skids</option>
              <option value="drums">Drums &amp; Barrels</option>
              <option value="gaylords">Gaylord Containers</option>
            </select>
          </label>

          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Subtype *</strong>
            <select
              style={inputStyle}
              value={form.materialSubtype}
              onChange={(e) => setForm({ ...form, materialSubtype: e.target.value })}
              required
            >
              {(TAXONOMY[form.materialCategory] || []).map((sub) => (
                <option key={sub} value={sub}>
                  {sub.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Volume & Period */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Required Mass per Period (kg) *</strong>
            <input
              style={inputStyle}
              type="number"
              min="0.001"
              step="any"
              value={form.massKgPerPeriod}
              onChange={(e) => setForm({ ...form, massKgPerPeriod: e.target.value })}
              required
            />
          </label>

          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Period *</strong>
            <select
              style={inputStyle}
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value as RequirementPeriod })}
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>

        {/* Min Grade & Max Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Minimum Acceptable Quality *</strong>
            <select
              style={inputStyle}
              value={form.minGrade}
              onChange={(e) => setForm({ ...form, minGrade: e.target.value as RequirementGrade })}
              required
            >
              <option value="A">Grade A (Premium / Near Virgin)</option>
              <option value="B">Grade B (Standard Reusable)</option>
              <option value="C">Grade C (Clean Scrap / Processing)</option>
              <option value="reject">Reject (Any Contamination-Tolerant)</option>
            </select>
          </label>

          <label>
            <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Maximum Acceptable Price ($/kg)</strong>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.01"
              placeholder="Leave empty for uncapped"
              value={form.maxPricePerKg}
              onChange={(e) => setForm({ ...form, maxPricePerKg: e.target.value })}
            />
          </label>
        </div>

        {/* Feasibility Mode */}
        <div style={{ border: '1px solid #eaecf0', padding: '1rem', borderRadius: '8px', backgroundColor: '#fcfcfd' }}>
          <strong style={{ color: '#101828', display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            Geographic Feasibility &amp; Sourcing Radius
          </strong>
          
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="feasibilityMode"
              checked={form.useCarbonLimit}
              onChange={() => setForm({ ...form, useCarbonLimit: true })}
              style={{ marginTop: '0.2rem' }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#101828' }}>Let ReLoop determine feasibility based on carbon avoidance</strong>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#475467' }}>
                ReLoop's carbon engine dynamically determines if transport emissions exceed virgin production avoided emissions.
              </p>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="feasibilityMode"
              checked={!form.useCarbonLimit}
              onChange={() => setForm({ ...form, useCarbonLimit: false })}
              style={{ marginTop: '0.2rem' }}
            />
            <div style={{ width: '100%' }}>
              <strong style={{ fontSize: '0.9rem', color: '#101828' }}>Specify maximum haul distance limit</strong>
              {!form.useCarbonLimit && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    style={{ ...inputStyle, width: '220px' }}
                    type="number"
                    min="1"
                    max="20000"
                    placeholder="e.g. 150 km"
                    value={form.maxDistanceKm}
                    onChange={(e) => setForm({ ...form, maxDistanceKm: e.target.value })}
                    required={!form.useCarbonLimit}
                  />
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#667085' }}>km</span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Description */}
        <label>
          <strong style={{ color: '#344054', fontSize: '0.9rem' }}>Material Description &amp; Processing Specs</strong>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="Specify any bale dimensions, clean requirements, or delivery schedule preferences..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={5000}
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || !form.facilityId}
          style={{
            backgroundColor: '#079455',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: saving || !form.facilityId ? 'not-allowed' : 'pointer',
            opacity: saving || !form.facilityId ? 0.7 : 1,
            marginTop: '0.5rem',
          }}
        >
          {saving ? 'Posting Requirement...' : 'Post Standing Requirement'}
        </button>
      </form>
    </main>
  );
};
