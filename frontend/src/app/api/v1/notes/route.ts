import { NextResponse } from 'next/server';
import { store } from '../../../../lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId') || undefined;

  const notes = store.getNotes(folderId);
  return NextResponse.json({
    data: notes,
    meta: {
      total: notes.length,
      requestId: `req_${Date.now()}`
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({
        error: {
          code: 'INVALID_ARGUMENT',
          message: 'Title and content are required'
        }
      }, { status: 400 });
    }

    const note = store.createNote({
      folderId: body.folderId || 'f_notes',
      source: body.source,
      type: body.type || 'PERSONAL',
      title: body.title,
      topicIds: body.topicIds || [],
      content: body.content,
      tags: body.tags || []
    });

    return NextResponse.json({
      data: note,
      meta: {
        requestId: `req_${Date.now()}`
      }
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: err.message
      }
    }, { status: 500 });
  }
}
