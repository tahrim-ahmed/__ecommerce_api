import { OrderStatusName } from '../enum/order-status-name.enum';

export const orderStatusObject = [
  {
    name: OrderStatusName.ORDERED,
  },
  {
    name: OrderStatusName.PROCESSING,
  },
  {
    name: OrderStatusName.PACKAGING,
  },
  {
    name: OrderStatusName.HANDED_TO_DELIVERY_TEAM,
  },
  {
    name: OrderStatusName.OUT_FOR_DELIVERY,
  },
  {
    name: OrderStatusName.DELIVERED,
  },
  {
    name: OrderStatusName.CANCELLED_BY_SELLER,
  },
  {
    name: OrderStatusName.CANCELLED_BY_USER,
  },
];
