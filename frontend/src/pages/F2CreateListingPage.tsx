import React from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationsApi } from '../features/organizations/api';
import { listingsApi } from '../features/listings/api';

const inputStyle = { width: '100%', padding: '0.6rem', marginTop: '0.25rem', boxSizing: 'border-box' as const };

export const F2CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = React.useState<Array<{ _id: string; name: string }>>([]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({
    facilityId: '', materialCategory: 'cardboard', materialSubtype: 'corrugated_cardboard', title: '', description: '', grade: 'B', massKg: '100', unitCount: '',
    length: '1200', width: '800', height: '150', packagingState: 'reusable', availableFrom: '', availableUntil: '', price: '0', openToOffers: true, hasForklift: false, packagingMode: 'palletised',
  });

  React.useEffect(() => {
    organizationsApi.getMe().then((organization) => {
      setFacilities(organization.facilities);
      if (organization.facilities[0]) setForm((current) => ({ ...current, facilityId: organization.facilities[0]._id }));
    }).catch(() => setError('Unable to load your facilities.'));
  }, []);

  const update = (field: string, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }));

  const saveDraft = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const listing = await listingsApi.create({
        facilityId: form.facilityId, materialCategory: form.materialCategory, materialSubtype: form.materialSubtype, title: form.title, description: form.description,
        grade: form.grade, massKg: Number(form.massKg), unitCount: form.unitCount ? Number(form.unitCount) : undefined,
        dimensionsMm: { length: Number(form.length), width: Number(form.width), height: Number(form.height) }, packagingState: form.packagingState,
        availableFrom: new Date(form.availableFrom).toISOString(), availableUntil: new Date(form.availableUntil).toISOString(),
        askingPrice: { amount: Number(form.price), currency: 'USD' }, openToOffers: form.openToOffers,
        pickupConstraints: { dockHours: { opens: '09:00', closes: '17:00' }, hasForklift: form.hasForklift, packagingMode: form.packagingMode },
      });
      for (const file of files) await listingsApi.uploadMedia(listing._id, file);
      if (files.length >= 3) await listingsApi.publish(listing._id);
      navigate('/my-listings');
    } catch (_error) {
      setError('The listing could not be saved. Check the required fields and add at least three images to publish.');
    } finally { setSaving(false); }
  };

  return <main style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>New material listing</h1>
    <p>Save a draft quickly, then add details and photos before publishing.</p>
    <form onSubmit={saveDraft} style={{ display: 'grid', gap: '1rem' }}>
      <label>Facility<select style={inputStyle} value={form.facilityId} onChange={(event) => update('facilityId', event.target.value)} required><option value="">Select a facility</option>{facilities.map((facility) => <option key={facility._id} value={facility._id}>{facility.name}</option>)}</select></label>
      <label>Title<input style={inputStyle} value={form.title} onChange={(event) => update('title', event.target.value)} required minLength={3} /></label>
      <label>Description<textarea style={inputStyle} value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><label>Category<select style={inputStyle} value={form.materialCategory} onChange={(event) => update('materialCategory', event.target.value)}><option value="cardboard">Corrugated cardboard</option><option value="plastics">Plastics</option><option value="pallets">Pallets</option><option value="drums">Drums</option><option value="gaylords">Gaylords</option></select></label><label>Subtype<input style={inputStyle} value={form.materialSubtype} onChange={(event) => update('materialSubtype', event.target.value)} required /></label></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><label>Grade<select style={inputStyle} value={form.grade} onChange={(event) => update('grade', event.target.value)}><option>A</option><option>B</option><option>C</option><option>reject</option></select></label><label>Mass (kg)<input style={inputStyle} type="number" min="0.001" step="any" value={form.massKg} onChange={(event) => update('massKg', event.target.value)} required /></label></div>
      <div><strong>Dimensions (mm)</strong><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>{(['length', 'width', 'height'] as const).map((field) => <input key={field} aria-label={field} style={inputStyle} type="number" min="1" value={form[field]} onChange={(event) => update(field, event.target.value)} required />)}</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><label>Available from<input style={inputStyle} type="datetime-local" value={form.availableFrom} onChange={(event) => update('availableFrom', event.target.value)} required /></label><label>Available until<input style={inputStyle} type="datetime-local" value={form.availableUntil} onChange={(event) => update('availableUntil', event.target.value)} required /></label></div>
      <label>Photos (minimum 3 to publish)<input style={inputStyle} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label>
      <label><input type="checkbox" checked={form.openToOffers} onChange={(event) => update('openToOffers', event.target.checked)} /> Open to offers</label>
      <label><input type="checkbox" checked={form.hasForklift} onChange={(event) => update('hasForklift', event.target.checked)} /> Forklift available</label>
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      <button type="submit" disabled={saving || !form.facilityId}>{saving ? 'Saving...' : 'Save draft / publish'}</button>
    </form>
  </main>;
};
