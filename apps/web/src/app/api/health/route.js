export async function GET() {
  try {
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      message: '小児科専門医試験アプリが正常に動作しています'
    });
  } catch (error) {
    return Response.json(
      { 
        status: 'error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}


