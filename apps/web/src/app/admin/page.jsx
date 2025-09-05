import { TestUserManager } from '../../components/Admin/TestUserManager';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <TestUserManager />
      </div>
    </div>
  );
}

