import { getUserFromToken } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ')
      ? auth.split(' ')[1]
      : null;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}