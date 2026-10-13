'use client'
import { type OperatorApplicationStatus, OPERATOR_APPLICATION_STATUS_LABEL } from './mockData'

export function OperatorApplicationStatusBadge({ status }: { status: OperatorApplicationStatus }) {
  return <span className="badge" data-operator-app-status={status}>{OPERATOR_APPLICATION_STATUS_LABEL[status]}</span>
}
