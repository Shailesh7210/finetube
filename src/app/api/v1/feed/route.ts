import { NextResponse } from 'next/server';
import { store } from '../../../../lib/store';

export async function GET(request: Request) {
  try {
    const feed = store.getFocusedFeed();
    return NextResponse.json({
      data: feed,
      meta: {
        total: feed.length,
        requestId: `req_${Date.now()}`
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: err.message
      }
    }, { status: 500 });
  }
}
