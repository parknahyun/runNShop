'use client'
import { type EventPriceStatus, EVENT_PRICE_STATUS_LABEL } from './mockData'

export function EventPriceStatusBadge({ status }: { status: EventPriceStatus }) {
  const dataAttr = status === 'ACTIVE' ? 'ON_SALE' : 'DISCONTINUED'
  return <span className="badge" data-product-status={dataAttr}>{EVENT_PRICE_STATUS_LABEL[status]}</span>
}
