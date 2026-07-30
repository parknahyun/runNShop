import { type ReturnStatus, type BlameType, RETURN_STATUS_LABEL, BLAME_TYPE_LABEL } from './mockData'

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  return <span className="badge" data-return-status={status}>{RETURN_STATUS_LABEL[status]}</span>
}

export function BlameBadge({ blame }: { blame: BlameType }) {
  return <span className="badge" data-blame-type={blame}>{BLAME_TYPE_LABEL[blame]}</span>
}
