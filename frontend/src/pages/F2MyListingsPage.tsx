import React from 'react';
import { Link } from 'react-router-dom';
import { Listing, listingsApi } from '../features/listings/api';

export const F2MyListingsPage: React.FC = () => {
  const [items, setItems] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    listingsApi.list({ status: 'draft' }).then((result) => setItems(result.items)).catch(() => setError('Unable to load listings.')).finally(() => setLoading(false));
  }, []);

  return <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h1>My listings</h1><Link to="/create-listing">New listing</Link></div>
    {loading && <p>Loading...</p>}{error && <p role="alert">{error}</p>}{!loading && !error && !items.length && <p>No drafts yet.</p>}
    {items.map((listing) => <article key={listing._id} style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}><strong>{listing.title}</strong><p>{listing.massKg} kg · {listing.materialCategory} · {listing.status}</p></article>)}
  </main>;
};
