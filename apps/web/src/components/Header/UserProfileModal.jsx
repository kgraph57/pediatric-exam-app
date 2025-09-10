import { useState, useEffect } from 'react';
import { User, MapPin, Building, Calendar, Award, GraduationCap, Heart, Brain, Target } from 'lucide-react';

export function UserProfileModal({ user, isOpen, onClose, onSave }) {
  const [profile, setProfile] = useState({
    name: user?.name || 'デモユーザー',
    email: user?.email || 'demo@example.com',
    birthYear: user?.birthYear || '1990',
    birthMonth: user?.birthMonth || '4',
    birthDay: user?.birthDay || '15',
    prefecture: user?.prefecture || '東京都',
    hospital: user?.hospital || '東京小児科病院',
    department: user?.department || '小児科',
    experienceYears: user?.experienceYears || '5',
    currentLevel: user?.level || 1,
    targetLevel: user?.targetLevel || 7,
    specialty: user?.specialty || '循環器',
    studyGoal: user?.studyGoal || '小児科専門医取得',
    dailyGoal: user?.dailyGoal || 15,
    weeklyGoal: user?.weeklyGoal || 80,
    studyTime: 'evening',
    studyFrequency: 'daily'
  });

  const [isEditing, setIsEditing] = useState(false);

  // 都道府県のリスト
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  // 診療科のリスト
  const departments = [
    '小児科', '小児外科', '新生児科', '小児循環器科', '小児神経科',
    '小児腎臓科', '小児内分泌科', '小児血液科', '小児腫瘍科',
    '小児感染症科', '小児アレルギー科', '小児リハビリテーション科',
    '小児救急科', '小児精神科', '小児皮膚科', '小児眼科',
    '小児耳鼻咽喉科', '小児整形外科', '小児泌尿器科',
    '小児放射線科', '小児病理科', '小児麻酔科',
    '総合診療科', 'その他'
  ];

  // 専門分野のリスト
  const specialties = [
    '循環器', '呼吸器', '消化器', '神経', '腎臓', '内分泌・代謝',
    '血液・腫瘍', '感染症', 'アレルギー', '新生児', '発達', '救急',
    '免疫', '遺伝', '代謝', '栄養', '成長・発達', '思春期',
    '小児外科', '小児麻酔', '小児放射線', '小児病理',
    '総合診療', 'その他'
  ];

  // 学習目標のリスト
  const studyGoals = [
    '小児科専門医取得', '小児科認定医取得', '小児科専門医試験合格',
    '知識の定着・更新', '臨床能力向上', '診療技術向上',
    '最新医学知識習得', '症例検討能力向上', '試験対策',
    'キャリアアップ', 'その他'
  ];

  useEffect(() => {
    if (user && isOpen) {
      setProfile({
        name: user.name || '',
        birthYear: user.birthYear || '',
        birthMonth: user.birthMonth || '',
        birthDay: user.birthDay || '',
        prefecture: user.prefecture || '',
        hospital: user.hospital || '',
        department: user.department || '',
        experienceYears: user.experienceYears || '',
        currentLevel: user.level || 1,
        targetLevel: user.targetLevel || 5,
        specialty: user.specialty || '',
        studyGoal: user.studyGoal || '',
        dailyGoal: user.dailyGoal || 10,
        weeklyGoal: user.weeklyGoal || 50
      });
    }
  }, [user, isOpen]);

  const handleSave = () => {
    onSave(profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 元の値に戻す
    if (user) {
      setProfile({
        name: user.name || '',
        birthYear: user.birthYear || '',
        birthMonth: user.birthMonth || '',
        birthDay: user.birthDay || '',
        prefecture: user.prefecture || '',
        hospital: user.hospital || '',
        department: user.department || '',
        experienceYears: user.experienceYears || '',
        currentLevel: user.level || 1,
        targetLevel: user.targetLevel || 5,
        specialty: user.specialty || '',
        studyGoal: user.studyGoal || '',
        dailyGoal: user.dailyGoal || 10,
        weeklyGoal: user.weeklyGoal || 50
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#262626] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* モーダルヘッダー */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ユーザープロフィール
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  個人情報と学習設定を管理できます
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  編集
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* モーダルコンテンツ */}
        <div className="p-6 space-y-6">
          {/* 基本情報 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              基本情報
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  氏名
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  生年月日
                </label>
                <div className="flex gap-2">
                                     <select
                     value={profile.birthYear}
                     onChange={(e) => setProfile(prev => ({ ...prev, birthYear: e.target.value }))}
                     disabled={!isEditing}
                     className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                   >
                     <option value="">年</option>
                     {Array.from({ length: 40 }, (_, i) => 1990 - i).map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                  <select
                    value={profile.birthMonth}
                    onChange={(e) => setProfile(prev => ({ ...prev, birthMonth: e.target.value }))}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">月</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={profile.birthDay}
                    onChange={(e) => setProfile(prev => ({ ...prev, birthDay: e.target.value }))}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="">日</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  出身地
                </label>
                <select
                  value={profile.prefecture}
                  onChange={(e) => setProfile(prev => ({ ...prev, prefecture: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">都道府県を選択</option>
                  {prefectures.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 医療従事者情報 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              医療従事者情報
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  所属病院・施設
                </label>
                                  <input
                    type="text"
                    value={profile.hospital}
                    onChange={(e) => setProfile(prev => ({ ...prev, hospital: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="例：東京小児科病院、○○大学病院小児科"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  診療科
                </label>
                <select
                  value={profile.department}
                  onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">診療科を選択</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  経験年数
                </label>
                                   <select
                     value={profile.experienceYears}
                     onChange={(e) => setProfile(prev => ({ ...prev, experienceYears: e.target.value }))}
                     disabled={!isEditing}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                   >
                     <option value="">経験年数を選択</option>
                     {Array.from({ length: 31 }, (_, i) => i).map(year => (
                       <option key={year} value={year}>{year}年</option>
                     ))}
                   </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  専門分野
                </label>
                <select
                  value={profile.specialty}
                  onChange={(e) => setProfile(prev => ({ ...prev, specialty: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">専門分野を選択</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 学習レベル・目標 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              学習レベル・目標
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  現在のレベル
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={profile.currentLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, currentLevel: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                    {profile.currentLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Lv.1 初心者</span>
                  <span>Lv.10 エキスパート</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  目標レベル
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={profile.targetLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, targetLevel: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                    {profile.targetLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Lv.1 初心者</span>
                  <span>Lv.10 エキスパート</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  学習目標
                </label>
                <select
                  value={profile.studyGoal}
                  onChange={(e) => setProfile(prev => ({ ...prev, studyGoal: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">学習目標を選択</option>
                  {studyGoals.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 学習設定 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              学習設定
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  1日の目標問題数
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={profile.dailyGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                    {profile.dailyGoal}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5問</span>
                  <span>50問</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  1週間の目標問題数
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={profile.weeklyGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-green-600 dark:text-blue-400 min-w-[2rem] text-center">
                    {profile.weeklyGoal}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>20問</span>
                  <span>200問</span>
                  </div>
              </div>
            </div>
          </div>

          {/* 学習スタイル設定 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              学習スタイル設定
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  学習時間帯
                </label>
                <select
                  value={profile.studyTime || 'morning'}
                  onChange={(e) => setProfile(prev => ({ ...prev, studyTime: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="morning">朝（6:00-9:00）</option>
                  <option value="afternoon">昼（12:00-15:00）</option>
                  <option value="evening">夕方（18:00-21:00）</option>
                  <option value="night">夜（21:00-24:00）</option>
                  <option value="flexible">時間を問わない</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  学習頻度
                </label>
                <select
                  value={profile.studyFrequency || 'daily'}
                  onChange={(e) => setProfile(prev => ({ ...prev, studyFrequency: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="daily">毎日</option>
                  <option value="weekdays">平日のみ</option>
                  <option value="weekends">週末のみ</option>
                  <option value="alternate">1日おき</option>
                  <option value="flexible">柔軟に</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        {isEditing && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
