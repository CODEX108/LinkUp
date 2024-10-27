import { getUserData } from '@/actions/get-user-data';
import { supabaseServerClient } from '@/supabase/supabaseServer';
import { NextResponse } from 'next/server';

// Add this line to explicitly mark the route as dynamic
export const dynamic = 'force-dynamic';

function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
}

export async function GET(req: Request) {
  try {
    // Create supabase client and get user data early in the request lifecycle
    const [supabase, userData] = await Promise.all([
      supabaseServerClient(),
      getUserData()
    ]);

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!userData) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!channelId) {
      return new Response('Bad Request', { status: 400 });
    }

    const page = Number(searchParams.get('page')) || 0;
    const size = Number(searchParams.get('size')) || 10;

    const { from, to } = getPagination(page, size);

    const { data, error } = await supabase
      .from('messages')
      .select('*, user: user_id (*)')
      .eq('channel_id', channelId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET MESSAGES ERROR: ', error);
      return new Response('Bad Request', { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('SERVER ERROR: ', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}