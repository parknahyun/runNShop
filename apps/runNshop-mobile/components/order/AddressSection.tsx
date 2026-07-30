interface Address {
  address_id: number;
  recipient: string;
  phone: string;
  zip_code: string;
  address: string;
  address_detail: string;
  is_default: boolean;
}

export function AddressSection({ address }: { address: Address }) {
  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-900">배송지</h2>
        <button className="text-xs text-primary">변경</button>
      </div>
      <p className="text-sm font-medium text-gray-900">{address.recipient}</p>
      <p className="text-sm text-gray-600 mt-0.5">{address.phone}</p>
      <p className="text-sm text-gray-600 mt-0.5">
        [{address.zip_code}] {address.address} {address.address_detail}
      </p>
      {address.is_default && (
        <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          기본 배송지
        </span>
      )}
    </div>
  );
}
