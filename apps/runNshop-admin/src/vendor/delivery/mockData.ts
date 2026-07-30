// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeliveryCompanyStatus = 'ACTIVE' | 'INACTIVE'

export interface DeliveryCompany {
  companyId: string
  companyCode: string
  companyName: string
  apiEndpoint: string
  trackingUrl: string
  apiConnected: boolean
  status: DeliveryCompanyStatus
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface DeliveryCompanyFilter {
  keyword: string
  status: DeliveryCompanyStatus | 'ALL'
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

export const DELIVERY_STATUS_LABEL: Record<DeliveryCompanyStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_DELIVERY_COMPANIES: DeliveryCompany[] = [
  {
    companyId: 'DLV-001', companyCode: 'CJ', companyName: 'CJ대한통운',
    apiEndpoint: 'https://api.cjlogistics.com/v1/tracking', trackingUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking?slipno={trackingNo}',
    apiConnected: true, status: 'ACTIVE', sortOrder: 1,
    createdAt: '2025-02-10 09:00:00', updatedAt: '2026-01-05 10:00:00',
  },
  {
    companyId: 'DLV-002', companyCode: 'HANJIN', companyName: '한진택배',
    apiEndpoint: 'https://api.hanjin.co.kr/v1/tracking', trackingUrl: 'https://www.hanjin.co.kr/kor/CMS/DeliverInfo/Delivery.do?wblnum={trackingNo}',
    apiConnected: true, status: 'ACTIVE', sortOrder: 2,
    createdAt: '2025-02-10 09:10:00', updatedAt: '2025-11-20 14:30:00',
  },
  {
    companyId: 'DLV-003', companyCode: 'LOTTE', companyName: '롯데택배',
    apiEndpoint: 'https://api.lotteglogis.com/v1/tracking', trackingUrl: 'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo={trackingNo}',
    apiConnected: false, status: 'ACTIVE', sortOrder: 3,
    createdAt: '2025-03-01 09:00:00', updatedAt: '2025-03-01 09:00:00',
  },
  {
    companyId: 'DLV-004', companyCode: 'LOGEN', companyName: '로젠택배',
    apiEndpoint: '', trackingUrl: 'https://www.ilogen.com/web/personal/trace/{trackingNo}',
    apiConnected: false, status: 'ACTIVE', sortOrder: 4,
    createdAt: '2025-04-15 11:00:00', updatedAt: '2025-04-15 11:00:00',
  },
  {
    companyId: 'DLV-005', companyCode: 'EPOST', companyName: '우체국택배',
    apiEndpoint: 'https://api.epost.go.kr/v1/tracking', trackingUrl: 'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1={trackingNo}',
    apiConnected: true, status: 'INACTIVE', sortOrder: 5,
    createdAt: '2025-05-20 09:00:00', updatedAt: '2026-04-01 16:00:00',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function filterDeliveryCompanies(items: DeliveryCompany[], filter: DeliveryCompanyFilter): DeliveryCompany[] {
  return items.filter((d) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (
        !d.companyName.toLowerCase().includes(kw) &&
        !d.companyCode.toLowerCase().includes(kw)
      ) return false
    }
    if (filter.status !== 'ALL' && d.status !== filter.status) return false
    return true
  })
}

export function nextCompanyId(items: DeliveryCompany[]): string {
  const max = items.reduce((acc, d) => {
    const n = parseInt(d.companyId.replace('DLV-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `DLV-${String(max + 1).padStart(3, '0')}`
}
