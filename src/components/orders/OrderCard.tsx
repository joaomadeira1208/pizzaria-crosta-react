import React from 'react';
import { Calendar, Clock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pedido } from '../../types';
import Card, { CardBody, CardFooter } from '../common/Card';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '../common/Button';

interface OrderCardProps {
  order: Pedido;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleTrackOrder = () => {
    navigate(`/track-order/${order.id}`);
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="overflow-hidden">
      <div className="bg-red-700 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <CardBody>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {order.status === 'DELIVERED' ? 'Delivered' : order.status === 'CANCELLED' ? 'Cancelled' : 'Estimated delivery'} at {formatDate(new Date(new Date(order.createdAt).getTime() + 45 * 60000).toString())}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Order Summary:</h4>
            <p className="text-sm text-gray-600">{itemCount} items · ${order.totalPrice.toFixed(2)}</p>

            <div className="mt-2 text-sm">
              <address className="not-italic text-gray-600">
                <div className="font-medium text-gray-700">Delivery Address:</div>
                {order.address.street}, {order.address.number}
                {order.address.complement && `, ${order.address.complement}`}<br />
                {order.address.district}, {order.address.city}, {order.address.state}<br />
                {order.address.zipCode}
              </address>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="bg-gray-50">
        <Button onClick={handleTrackOrder} variant="primary" fullWidth>
          Track Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;