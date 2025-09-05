import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// バックアップを復元
export async function POST(request, { params }) {
  try {
    const { id } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      const backup = backups.find(b => b.id === id);

      if (!backup) {
        return Response.json(
          { message: 'バックアップが見つかりません' },
          { status: 404 }
        );
      }

      // 現在のデータをバックアップ（復元前の状態を保存）
      const currentBackup = {
        users: JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
        invitations: JSON.parse(localStorage.getItem('invitations') || '[]'),
        logs: JSON.parse(localStorage.getItem('usageLogs') || '[]'),
        notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
        userProgress: JSON.parse(localStorage.getItem('userProgress') || '{}'),
        currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}')
      };

      // 復元前のバックアップを保存
      const restoreBackup = {
        id: `restore_${Date.now()}`,
        name: `復元前バックアップ_${new Date().toISOString().split('T')[0]}`,
        description: '復元前の自動バックアップ',
        data: currentBackup,
        createdAt: new Date().toISOString(),
        size: JSON.stringify(currentBackup).length
      };

      const allBackups = JSON.parse(localStorage.getItem('backups') || '[]');
      allBackups.unshift(restoreBackup);
      localStorage.setItem('backups', JSON.stringify(allBackups));

      // バックアップデータを復元
      if (backup.data.users) {
        localStorage.setItem('registeredUsers', JSON.stringify(backup.data.users));
      }
      if (backup.data.invitations) {
        localStorage.setItem('invitations', JSON.stringify(backup.data.invitations));
      }
      if (backup.data.logs) {
        localStorage.setItem('usageLogs', JSON.stringify(backup.data.logs));
      }
      if (backup.data.notifications) {
        localStorage.setItem('notifications', JSON.stringify(backup.data.notifications));
      }
      if (backup.data.userProgress) {
        localStorage.setItem('userProgress', JSON.stringify(backup.data.userProgress));
      }
      if (backup.data.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(backup.data.currentUser));
      }

      return Response.json({
        message: 'バックアップが復元されました',
        restoredAt: new Date().toISOString()
      });
    }

    // データベースからバックアップを取得
    const backupResult = await pool.query(
      'SELECT * FROM backups WHERE id = $1',
      [id]
    );

    if (backupResult.rows.length === 0) {
      return Response.json(
        { message: 'バックアップが見つかりません' },
        { status: 404 }
      );
    }

    const backup = backupResult.rows[0];
    const backupData = JSON.parse(backup.data);

    // トランザクションで復元を実行
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 既存のデータを削除
      await client.query('DELETE FROM study_history');
      await client.query('DELETE FROM notifications');
      await client.query('DELETE FROM usage_logs');
      await client.query('DELETE FROM invitations');
      await client.query('DELETE FROM users');

      // バックアップデータを復元
      if (backupData.users && backupData.users.length > 0) {
        for (const user of backupData.users) {
          await client.query(
            `INSERT INTO users (
              id, name, email, password_hash, hospital, department,
              experience_years, target_level, specialty, study_goal,
              daily_goal, weekly_goal, level, total_answered, total_correct,
              streak, longest_streak, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [
              user.id, user.name, user.email, user.password_hash, user.hospital, user.department,
              user.experience_years, user.target_level, user.specialty, user.study_goal,
              user.daily_goal, user.weekly_goal, user.level, user.total_answered, user.total_correct,
              user.streak, user.longest_streak, user.created_at, user.updated_at
            ]
          );
        }
      }

      if (backupData.invitations && backupData.invitations.length > 0) {
        for (const invitation of backupData.invitations) {
          await client.query(
            `INSERT INTO invitations (
              id, code, email, name, hospital, department,
              created_at, expires_at, used_at, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              invitation.id, invitation.code, invitation.email, invitation.name,
              invitation.hospital, invitation.department, invitation.created_at,
              invitation.expires_at, invitation.used_at, invitation.created_by
            ]
          );
        }
      }

      if (backupData.logs && backupData.logs.length > 0) {
        for (const log of backupData.logs) {
          await client.query(
            `INSERT INTO usage_logs (
              id, user_id, action, details, timestamp, ip_address, user_agent
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              log.id, log.user_id, log.action, JSON.stringify(log.details),
              log.timestamp, log.ip_address, log.user_agent
            ]
          );
        }
      }

      if (backupData.notifications && backupData.notifications.length > 0) {
        for (const notification of backupData.notifications) {
          await client.query(
            `INSERT INTO notifications (
              id, type, title, message, status, priority, data, created_at, read_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              notification.id, notification.type, notification.title, notification.message,
              notification.status, notification.priority, JSON.stringify(notification.data),
              notification.created_at, notification.read_at
            ]
          );
        }
      }

      if (backupData.studyHistory && backupData.studyHistory.length > 0) {
        for (const history of backupData.studyHistory) {
          await client.query(
            `INSERT INTO study_history (
              id, user_id, question_id, category, is_correct, attempts, is_favorite, answered_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              history.id, history.user_id, history.question_id, history.category,
              history.is_correct, history.attempts, history.is_favorite, history.answered_at
            ]
          );
        }
      }

      await client.query('COMMIT');

      return Response.json({
        message: 'バックアップが復元されました',
        restoredAt: new Date().toISOString()
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Restore backup error:', error);
    return Response.json(
      { message: 'バックアップの復元に失敗しました' },
      { status: 500 }
    );
  }
}
