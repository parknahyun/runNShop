'use client'
import { type BlameType, BLAME_TYPE_LABEL } from './mockData'

export function ClaimBlameBadge({ blameType }: { blameType: BlameType }) {
  return <span className="badge" data-claim-blame={blameType}>{BLAME_TYPE_LABEL[blameType]}</span>
}
