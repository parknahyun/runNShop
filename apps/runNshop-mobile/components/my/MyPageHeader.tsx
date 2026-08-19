interface MemberSummary {
  memberId: string;
  name: string;
  grade: string;
  gradeIcon: string;
  point: number;
  couponCount: number;
  reviewCount: number;
  orderStatusSummary: {
    paymentCompleted: number;
    preparing: number;
    inDelivery: number;
    delivered: number;
  };
}

export function MyPageHeader({ member }: { member: MemberSummary }) {
  return (
    <div className="bg-white px-4 pt-5 pb-4">
      {/* 회원 정보 */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
          {member.gradeIcon}
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">{member.name}님</p>
          <p className="text-xs text-gray-500">{member.grade}</p>
        </div>
      </div>

      {/* 포인트 / 쿠폰 / 리뷰 */}
      <div className="grid grid-cols-3 mt-4 border border-gray-100 rounded-lg divide-x divide-gray-100">
        <InfoCell label="포인트" value={`${member.point.toLocaleString()}P`} />
        <InfoCell label="쿠폰" value={`${member.couponCount}장`} />
        <InfoCell label="리뷰" value={`${member.reviewCount}건`} />
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
