import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;

  // Build query based on role
  let query = supabase.from('tasks').select('*');

  // If intern or dev, only show their assigned tasks
  if (role === 'intern' || role === 'junior_developer' || role === 'senior_developer') {
    query = query.eq('assignee_id', user.id);
  }
  // Otherwise, return all tasks (Admins, Managers, Team Leads)

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }

  return NextResponse.json({ data, status: 200 });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    const updates: any = { status };
    if (status === 'Completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error', status: 500 }, { status: 500 });
  }
}
