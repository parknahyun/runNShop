import { NextResponse } from 'next/server';

export async function PATCH() {
  return NextResponse.json({ code: 'SUCCESS', data: null });
}
