import { getUserData } from '@/actions/get-user-data';
import { supabaseServerClient } from '@/supabase/supabaseServer';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
}

export async function GET(req: Request) {
  try {
    // Add individual try-catch blocks to identify where the error might be occurring
    let supabase;
    try {
      supabase = await supabaseServerClient();
    } catch (error) {
      console.error('Supabase Client Error:', error);
      return NextResponse.json(
        { error: 'Failed to initialize database connection' },
        { status: 500 }
      );
    }

    let userData;
    try {
      userData = await getUserData();
    } catch (error) {
      console.error('Get User Data Error:', error);
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!userData) {
      console.error('No user data found');
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (!channelId) {
      console.error('No channel ID provided');
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    const page = Number(searchParams.get('page')) || 0;
    const size = Number(searchParams.get('size')) || 10;

    const { from, to } = getPagination(page, size);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, user: user_id (*)')
        .eq('channel_id', channelId)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Query Error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch messages' },
          { status: 400 }
        );
      }

      return NextResponse.json({ data });
    } catch (error) {
      console.error('Database Query Error:', error);
      return NextResponse.json(
        { error: 'Failed to execute database query' },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log the full error object for debugging
    const err = error as Error;
    console.error('Unhandled Server Error:', {
      message: err.message,
      stack: err.stack,
      cause: (err as any).cause
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}