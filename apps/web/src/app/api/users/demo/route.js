import sql from '@/app/api/utils/sql';

export async function GET(request) {
  try {
    // Get the demo user (first user with demo email)
    const result = await sql('SELECT * FROM users WHERE email = $1', ['demo@example.com']);
    
    if (result.length === 0) {
      return Response.json(
        { error: 'Demo user not found' },
        { status: 404 }
      );
    }

    const user = result[0];
    return Response.json(user);
  } catch (error) {
    console.error('Error fetching demo user:', error);
    return Response.json(
      { error: 'Failed to fetch demo user' },
      { status: 500 }
    );
  }
}