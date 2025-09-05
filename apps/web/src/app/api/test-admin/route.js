export async function GET(request) {
  try {
    return Response.json({
      message: '管理者APIテスト成功',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test admin error:', error);
    return Response.json(
      { message: 'テストAPIエラー' },
      { status: 500 }
    );
  }
}
