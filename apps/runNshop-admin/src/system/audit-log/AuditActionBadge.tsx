'use client'
import { type AuditAction, AUDIT_ACTION_LABEL } from './mockData'

export function AuditActionBadge({ action }: { action: AuditAction }) {
  return <span className="badge" data-audit-action={action}>{AUDIT_ACTION_LABEL[action]}</span>
}
