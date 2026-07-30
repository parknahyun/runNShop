import { type ExchangeStatus, EXCHANGE_STATUS_LABEL } from './mockData'

export function ExchangeStatusBadge({ status }: { status: ExchangeStatus }) {
  return <span className="badge" data-exchange-status={status}>{EXCHANGE_STATUS_LABEL[status]}</span>
}
