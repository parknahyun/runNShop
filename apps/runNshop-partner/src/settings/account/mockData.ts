export interface AccountManager {
  manager_name: string
  email: string
  phone: string
}

export interface SettlementAccount {
  bank_name: string
  account_number: string
  account_holder: string
}

export const BANK_OPTIONS = ['국민은행', '신한은행', '우리은행', '하나은행', '농협은행', 'IBK기업은행']

export const MOCK_MANAGER: AccountManager = {
  manager_name: '김민수',
  email: 'minsu.kim@nike.co.kr',
  phone: '010-1234-5678',
}

export const MOCK_SETTLEMENT_ACCOUNT: SettlementAccount = {
  bank_name: '국민은행',
  account_number: '110-1234-5678',
  account_holder: '나이키코리아(유)',
}

export function maskAccountNumber(accountNumber: string): string {
  const parts = accountNumber.split('-')
  if (parts.length < 2) return accountNumber
  return [parts[0], '***', parts[parts.length - 1]].join('-')
}
