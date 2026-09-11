import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ordersApi, Order } from '../features/orders/api';

export const OrdersPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list(),
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>B2B Orders & Claims</h1>
      <p style={{ color: '#6b7280' }}>Transactions and material handovers for your organization.</p>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data?.data?.length ? (
            data.data.map((order: Order) => (
              <div key={order._id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{order.orderNumber}</strong>
                  <span style={{ textTransform: 'capitalize', color: '#059669', fontWeight: 600 }}>{order.status}</span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>
                  Type: {order.orderType} | Quantity: {order.quantity} {order.unit}
                </p>
                <Link to={`/orders/${order._id}`} style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.875rem' }}>
                  View Order Details →
                </Link>
              </div>
            ))
          ) : (
            <div style={{ border: '1px dashed #d1d5db', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
              <p style={{ color: '#9ca3af' }}>No active orders or material claims recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
