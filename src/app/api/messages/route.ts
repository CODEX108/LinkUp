import { getUserData } from '@/actions/get-user-data';
import { supabaseServerClient } from '@/supabase/supabaseServer';
import { NextResponse } from 'next/server';
// Import for rethrow removed

function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get('channelId');
  const page = Number(searchParams.get('page'));
  const size = Number(searchParams.get('size'));

  if (!channelId) {
    return new Response('Bad Request', { status: 400 });
  }

  const { from, to } = getPagination(page, size);

  try {
    const supabase = await supabaseServerClient();
    const userData = await getUserData();

    if (!userData) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*, user: user_id (*)')
      .eq('channel_id', channelId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('GET MESSAGES ERROR: ', error);
      return new Response('Bad Request', { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    throw error; // Re-throw any errors
    console.error('SERVER ERROR: ', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
