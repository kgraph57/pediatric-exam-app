import sql from '@/app/api/utils/sql';

// テストユーザーの学習データをリセット
export async function POST(request, { params }) {
  try {
    const { id } = params;

    if (!id || !id.startsWith('test_')) {
      return Response.json(
        { error: 'テストユーザーのみリセット可能です' },
        { status: 400 }
      );
    }

    // トランザクション開始
    await sql('BEGIN');

    try {
      // ユーザーの学習統計をリセット
      await sql(`
        UPDATE users 
        SET 
          level = 1,
          total_answered = 0,
          total_correct = 0,
          streak = 0,
          longest_streak = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);

      // 学習履歴を削除
      await sql('DELETE FROM study_history WHERE user_id = $1', [id]);

      // カテゴリ別統計を削除
      await sql('DELETE FROM category_stats WHERE user_id = $1', [id]);

      // デイリーミッションを削除
      await sql('DELETE FROM daily_missions WHERE user_id = $1', [id]);

      // ストリークデータを削除
      await sql('DELETE FROM user_streaks WHERE user_id = $1', [id]);

      // トランザクションコミット
      await sql('COMMIT');

      return Response.json({
        success: true,
        message: 'テストユーザーの学習データがリセットされました',
        resetData: {
          level: 1,
          total_answered: 0,
          total_correct: 0,
          streak: 0,
          longest_streak: 0
        }
      });

    } catch (error) {
      // エラーが発生した場合はロールバック
      await sql('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error resetting test user:', error);
    return Response.json(
      { error: 'テストユーザーのリセットに失敗しました' },
      { status: 500 }
    );
  }
}

// テストユーザーの削除
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || !id.startsWith('test_')) {
      return Response.json(
        { error: 'テストユーザーのみ削除可能です' },
        { status: 400 }
      );
    }

    // ユーザーが存在するか確認
    const userResult = await sql('SELECT id FROM users WHERE id = $1', [id]);
    
    if (userResult.length === 0) {
      return Response.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // トランザクション開始
    await sql('BEGIN');

    try {
      // 関連データを削除（外部キー制約により自動削除されるはずだが、明示的に削除）
      await sql('DELETE FROM study_history WHERE user_id = $1', [id]);
      await sql('DELETE FROM category_stats WHERE user_id = $1', [id]);
      await sql('DELETE FROM daily_missions WHERE user_id = $1', [id]);
      await sql('DELETE FROM user_streaks WHERE user_id = $1', [id]);

      // ユーザーを削除
      await sql('DELETE FROM users WHERE id = $1', [id]);

      // トランザクションコミット
      await sql('COMMIT');

      return Response.json({
        success: true,
        message: 'テストユーザーが削除されました'
      });

    } catch (error) {
      // エラーが発生した場合はロールバック
      await sql('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error deleting test user:', error);
    return Response.json(
      { error: 'テストユーザーの削除に失敗しました' },
      { status: 500 }
    );
  }
}

