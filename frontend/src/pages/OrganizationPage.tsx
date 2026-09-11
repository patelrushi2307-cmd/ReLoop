import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { organizationsApi, Organization } from '../features/organizations/api';

type OrganizationRole = Organization['roles'][number];
const organizationRoles: OrganizationRole[] = ['seller', 'buyer', 'recycler', 'carrier'];

export const OrganizationPage: React.FC = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ legalName: '', businessId: '', roles: ['seller'] as OrganizationRole[] });
  const [facilityForm, setFacilityForm] = React.useState({ name: '', street: '', city: '', country: '', longitude: '', latitude: '', hasForklift: false });

  const loadOrganization = React.useCallback(async () => {
    try {
      const data = await organizationsApi.getMe();
      setOrganization(data);
      setForm({ legalName: data.legalName || data.name, businessId: data.businessId || '', roles: data.roles });
    } catch (_error) {
      setError('Unable to load your organization. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void loadOrganization(); }, [loadOrganization]);

  const toggleRole = (role: OrganizationRole) => {
    setForm((current) => ({ ...current, roles: current.roles.includes(role) ? current.roles.filter((item) => item !== role) : [...current.roles, role] }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await organizationsApi.updateMe(form);
      setOrganization((current) => current ? { ...current, ...data } : data);
    } catch (_error) {
      setError('Unable to save organization details.');
    } finally {
      setSaving(false);
    }
  };

  const submitVerification = async () => {
    try { setOrganization(await organizationsApi.submitVerification()); }
    catch (_error) { setError('Unable to submit verification.'); }
  };

  const addFacility = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const facility = await organizationsApi.addFacility({
        name: facilityForm.name,
        address: { street: facilityForm.street, city: facilityForm.city, country: facilityForm.country },
        location: { type: 'Point', coordinates: [Number(facilityForm.longitude), Number(facilityForm.latitude)] },
        operatingHours: { monday: { closed: false, opens: '09:00', closes: '17:00' } },
        hasForklift: facilityForm.hasForklift,
      });
      setOrganization((current) => current ? { ...current, facilities: [facility, ...current.facilities] } : current);
      setFacilityForm({ name: '', street: '', city: '', country: '', longitude: '', latitude: '', hasForklift: false });
    } catch (_error) { setError('Unable to add facility. Check the address and coordinates.'); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Organization onboarding</h1>
      <p>{user?.name} · {user?.email}</p>
      {loading ? <p>Loading organization...</p> : organization ? <>
        <form onSubmit={save} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
          <h2>Company details</h2>
          <label>Legal name<input value={form.legalName} onChange={(event) => setForm({ ...form, legalName: event.target.value })} required /></label>
          <label>Business identifier<input value={form.businessId} onChange={(event) => setForm({ ...form, businessId: event.target.value })} /></label>
          <fieldset><legend>Business roles</legend>{organizationRoles.map((role) => <label key={role}><input type="checkbox" checked={form.roles.includes(role)} onChange={() => toggleRole(role)} /> {role}</label>)}</fieldset>
          <button type="submit" disabled={saving || form.roles.length === 0}>{saving ? 'Saving...' : 'Save company details'}</button>
        </form>
        <section style={{ marginTop: '1.5rem' }}><h2>Verification</h2><p>Status: <strong>{organization.verificationStatus}</strong></p>{organization.verificationStatus === 'unverified' && <button type="button" onClick={() => void submitVerification()}>Submit for verification</button>}</section>
        <section style={{ marginTop: '1.5rem' }}><h2>Facilities</h2>{organization.facilities.length ? organization.facilities.map((facility) => <p key={facility._id}>{facility.name} · {facility.address.city}, {facility.address.country}</p>) : <p>No facilities added yet.</p>}
          <form onSubmit={addFacility} style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3>Add facility</h3>
            <label>Facility name<input value={facilityForm.name} onChange={(event) => setFacilityForm({ ...facilityForm, name: event.target.value })} required /></label>
            <label>Street address<input value={facilityForm.street} onChange={(event) => setFacilityForm({ ...facilityForm, street: event.target.value })} required /></label>
            <label>City<input value={facilityForm.city} onChange={(event) => setFacilityForm({ ...facilityForm, city: event.target.value })} required /></label>
            <label>Country<input value={facilityForm.country} onChange={(event) => setFacilityForm({ ...facilityForm, country: event.target.value })} required /></label>
            <label>Longitude<input type="number" min="-180" max="180" step="any" value={facilityForm.longitude} onChange={(event) => setFacilityForm({ ...facilityForm, longitude: event.target.value })} required /></label>
            <label>Latitude<input type="number" min="-90" max="90" step="any" value={facilityForm.latitude} onChange={(event) => setFacilityForm({ ...facilityForm, latitude: event.target.value })} required /></label>
            <label><input type="checkbox" checked={facilityForm.hasForklift} onChange={(event) => setFacilityForm({ ...facilityForm, hasForklift: event.target.checked })} /> Forklift available</label>
            <button type="submit">Add facility</button>
          </form>
        </section>
      </> : <p>No organization is associated with this account.</p>}
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
    </div>
  );
};
