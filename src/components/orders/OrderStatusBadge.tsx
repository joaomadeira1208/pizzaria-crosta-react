import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  let color = '';
  let statusText = '';
  
  switch (status) {
    case 'PENDING':
      color = 'bg-yellow-100 text-yellow-800';
      statusText = 'Pending';
      break;
    case 'IN_PREPARATION':
      color = 'bg-blue-100 text-blue-800';
      statusText = 'In Preparation';
      break;
    case 'READY':
      color = 'bg-green-100 text-green-800';
      statusText = 'Ready';
      break;
    case 'OUT_FOR_DELIVERY':
      color = 'bg-purple-100 text-purple-800';
      statusText = 'Out for Delivery';
      break;
    case 'DELIVERED':
      color = 'bg-green-100 text-green-800';
      statusText = 'Delivered';
      break;
    case 'CANCELLED':
      color = 'bg-red-100 text-red-800';
      statusText = 'Cancelled';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      statusText = status;
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {statusText}
    </span>
  );
};

export default OrderStatusBadge;