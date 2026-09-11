import React from 'react';
import { useAuth } from '../auth/AuthProvider';

export const OrganizationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>B2B Organization Profile</h1>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', marginTop: '1.5rem' }}>
        <p><strong>Member Name:</strong> {user?.name}</p>
        <p><strong>Work Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        {typeof user?.organizationId === 'object' && user.organizationId ? (
          <>
            <p><strong>Organization Name:</strong> {user.organizationId.name}</p>
            <p><strong>Organization Type:</strong> {user.organizationId.type}</p>
            <p><strong>Location:</strong> {user.organizationId.address?.city}, {user.organizationId.address?.country}</p>
            <p><strong>Verification Status:</strong> {user.organizationId.verified ? 'Verified' : 'Pending Verification'}</p>
          </>
        ) : (
          <p><strong>Organization ID:</strong> {user?.organizationId || 'None assigned'}</p>
        )}
      </div>
    </div>
  );
};
