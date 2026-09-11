import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialsApi } from '../features/materials/api';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    materialType: 'cardboard',
    condition: 'reusable',
    quantity: 100,
    unit: 'units',
    pricePerUnit: 0,
    isFreeClaim: true,
    city: '',
    address: '',
    longitude: -87.6298,
    latitude: 41.8781,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await materialsApi.create({
        title: form.title,
        description: form.description,
        materialType: form.materialType,
        condition: form.condition as any,
        quantity: Number(form.quantity),
        unit: form.unit as any,
        pricePerUnit: form.isFreeClaim ? 0 : Number(form.pricePerUnit),
        isFreeClaim: form.isFreeClaim,
        pickupLocation: {
          address: form.address,
          city: form.city,
          location: {
            type: 'Point',
            coordinates: [Number(form.longitude), Number(form.latitude)],
          },
        },
      });
      navigate('/marketplace');
    } catch (err) {
      alert('Error creating listing. Ensure you are signed in.');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Post Surplus Packaging Lot</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem' }}>Lot Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem' }}>Material Category</label>
          <select
            value={form.materialType}
            onChange={(e) => setForm({ ...form, materialType: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="cardboard">Cardboard</option>
            <option value="plastic">Plastic</option>
            <option value="pallets">Pallets</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem' }}>Quantity</label>
            <input
              type="number"
              required
              min={1}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem' }}>Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            >
              <option value="units">units</option>
              <option value="kg">kg</option>
              <option value="tonnes">tonnes</option>
              <option value="pallets">pallets</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.isFreeClaim}
              onChange={(e) => setForm({ ...form, isFreeClaim: e.target.checked })}
            />
            Free Circular Reallocation (Zero Cost)
          </label>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem' }}>Pickup City</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem' }}>Pickup Facility Street Address</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
        >
          Publish Material Listing
        </button>
      </form>
    </div>
  );
};
