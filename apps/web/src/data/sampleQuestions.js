export const sampleQuestions = [
  {
    id: 1,
    category: "新生児・周産期",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "在胎28週、出生体重980gで出生した早産児。生後24時間で呼吸窮迫が増悪し、人工呼吸器管理となった。FiO2 0.8でもSpO2 85%を維持できない。胸部X線で両側肺野の透過性低下と顆粒状陰影を認める。心エコーでPDAを認める。この症例で最も適切な治療はどれか。",
    options: [
      "高頻度振動換気（HFOV）への変更",
      "一酸化窒素（NO）吸入療法",
      "肺サーファクタントの追加投与",
      "PDAの薬物治療",
      "ステロイドパルス療法"
    ],
    correctAnswer: 0,
    explanation: {
      "0": "◯ 高頻度振動換気（HFOV）への変更 - 従来の人工呼吸器で酸素化が不良な場合の次のステップ。肺胞の虚脱を防ぎ、酸素化を改善する。",
      "1": "× 一酸化窒素（NO）吸入療法 - 肺高血圧症の治療。この症例では酸素化不良が主問題。",
      "2": "× 肺サーファクタントの追加投与 - 既に投与済みの可能性が高く、追加投与の効果は限定的。",
      "3": "× PDAの薬物治療 - 酸素化不良の原因ではなく、結果として生じている。",
      "4": "× ステロイドパルス療法 - 慢性肺疾患の予防・治療。急性期の酸素化改善には効果が遅い。"
    },
    keyLearningPoints: [
      "早産児の呼吸管理の段階的アプローチを理解する",
      "HFOVの適応と効果を理解する",
      "PDAと呼吸状態の因果関係を正しく評価する"
    ],
    references: [
      "日本新生児成育医学会：早産児呼吸管理ガイドライン2021",
      "European Consensus Guidelines on RDS Management 2022",
      "Neonatology: A Practical Approach to Neonatal Diseases, 3rd Edition"
    ]
  },
  {
    id: 2,
    category: "循環器",
    difficulty: "専門医レベル",
    type: "MBA",
    question: "3歳の男児。学校検診で心雑音を指摘されて来院した。無症状。心エコーで心室中隔欠損（VSD）を認める。欠損孔の径は6mm、位置は膜様部。左心室から右心室へのシャントを認める。右心室圧は左心室圧の60%。この症例で適切な対応はどれか。正しいものを2つ選べ。",
    options: [
      "経過観察",
      "カテーテル治療",
      "外科手術",
      "運動制限",
      "感染性心内膜炎予防"
    ],
    correctAnswer: [0, 4],
    explanation: {
      "0": "◯ 経過観察 - 6mmの膜様部VSDで右心室圧が60%以下、無症状であれば自然閉鎖の可能性がある。",
      "1": "× カテーテル治療 - 膜様部VSDは技術的に困難で、適応外。",
      "2": "× 外科手術 - 現時点では適応なし。右心室圧上昇や症状出現時に検討。",
      "3": "× 運動制限 - 通常は不要。",
      "4": "◯ 感染性心内膜炎予防 - VSDがあるため、歯科処置時などの予防が必要。"
    },
    keyLearningPoints: [
      "VSDの治療適応を理解する",
      "膜様部VSDの自然経過を理解する",
      "感染性心内膜炎予防の重要性"
    ],
    references: [
      "日本小児循環器学会：先天性心疾患治療ガイドライン2020",
      "American Heart Association: VSD Management Guidelines",
      "European Society of Cardiology: Pediatric Guidelines 2021"
    ]
  },
  {
    id: 3,
    category: "内分泌・代謝",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "生後2週の新生児。新生児マススクリーニングで17-OHP高値を指摘された。TSH、fT4は正常。17-OHP 45ng/mL（基準値：0.5-3.0）。血清Na 128mEq/L、K 6.2mEq/L。尿中Na排泄量は増加している。この症例で最も適切な治療はどれか。",
    options: [
      "甲状腺ホルモン製剤の投与",
      "副腎皮質ホルモンの投与",
      "ミネラルコルチコイドの投与",
      "成長ホルモンの投与",
      "抗生剤の投与"
    ],
    correctAnswer: 2,
    explanation: {
      "0": "× 甲状腺ホルモン製剤の投与 - 甲状腺機能は正常。",
      "1": "× 副腎皮質ホルモンの投与 - 糖質コルチコイドは必要だが、電解質異常の主因ではない。",
      "2": "◯ ミネラルコルチコイドの投与 - 21-水酸化酵素欠損症による塩類喪失型。フロリネフが第一選択。",
      "3": "× 成長ホルモンの投与 - 成長ホルモン分泌不全症の治療。",
      "4": "× 抗生剤の投与 - 感染症の治療。"
    },
    keyLearningPoints: [
      "先天性副腎皮質過形成の病態を理解する",
      "21-水酸化酵素欠損症の電解質異常の機序",
      "ミネラルコルチコイドの重要性"
    ],
    references: [
      "日本小児内分泌学会：先天性副腎皮質過形成診療ガイドライン",
      "Endocrine Society: Congenital Adrenal Hyperplasia Guidelines",
      "Pediatric Endocrinology: A Clinical Handbook, 4th Edition"
    ]
  },
  {
    id: 4,
    category: "感染症・免疫",
    difficulty: "専門医レベル",
    type: "MBA",
    question: "2歳の女児。発熱（39.5℃）と発疹を主訴に来院した。発熱は4日前から、発疹は昨日から出現。発疹は顔面から始まり、体幹・四肢に広がった。口腔内にKoplik斑を認める。結膜充血、流涙を認める。この症例で適切な対応はどれか。正しいものを2つ選べ。",
    options: [
      "抗生剤の投与",
      "解熱剤の投与",
      "抗ウイルス薬の投与",
      "隔離",
      "ビタミンAの投与"
    ],
    correctAnswer: [1, 3],
    explanation: {
      "0": "× 抗生剤の投与 - ウイルス感染症には無効。",
      "1": "◯ 解熱剤の投与 - 発熱による不快感の軽減。",
      "2": "× 抗ウイルス薬の投与 - 麻疹には特効薬なし。",
      "3": "◯ 隔離 - 感染力が強く、他者への感染を防ぐため必要。",
      "4": "× ビタミンAの投与 - 発展途上国での合併症予防。日本では通常不要。"
    },
    keyLearningPoints: [
      "麻疹の特徴的な症状を覚える",
      "Koplik斑の診断的価値を理解する",
      "感染症の隔離の重要性"
    ],
    references: [
      "日本小児科学会：予防接種ガイドライン2023",
      "CDC: Measles Clinical Features and Diagnosis",
      "WHO: Measles Fact Sheet 2023"
    ]
  },
  {
    id: 5,
    category: "神経・発達",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "5歳の男児。幼稚園で集団生活が困難で来院した。視線が合わない、名前を呼んでも反応しない、一人遊びを好む。言語発達は遅れている。家族歴に自閉症はない。この症例で最も適切な対応はどれか。",
    options: [
      "経過観察",
      "発達検査の実施",
      "薬物療法の開始",
      "療育施設への入所",
      "精神科への紹介"
    ],
    correctAnswer: 1,
    explanation: {
      "0": "× 経過観察 - 早期発見・早期介入が重要。放置すると症状が固定化する。",
      "1": "◯ 発達検査の実施 - 自閉スペクトラム症の診断のため、標準化された発達検査が必要。",
      "2": "× 薬物療法の開始 - 診断確定前の薬物療法は不適切。",
      "3": "× 療育施設への入所 - 診断確定後の対応。",
      "4": "× 精神科への紹介 - 小児科で発達評価を行ってから検討。"
    },
    keyLearningPoints: [
      "自閉スペクトラム症の早期発見の重要性",
      "発達検査の適切な実施時期",
      "段階的な診断・治療アプローチ"
    ],
    references: [
      "日本小児科学会：発達障害診療ガイドライン",
      "American Academy of Pediatrics: Autism Screening Guidelines",
      "DSM-5: Diagnostic and Statistical Manual of Mental Disorders"
    ]
  },
  {
    id: 6,
    category: "血液・腫瘍",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "8歳の女児。2週間前から発熱、倦怠感、関節痛を認める。昨日から両下肢に紫斑を認める。血小板数 15,000/μL、PT 15秒（基準値：11-13）、APTT 45秒（基準値：25-35）。この症例で最も可能性の高い疾患はどれか。",
    options: [
      "特発性血小板減少性紫斑病（ITP）",
      "血友病",
      "播種性血管内凝固症候群（DIC）",
      "白血病",
      "アレルギー性紫斑病"
    ],
    correctAnswer: 2,
    explanation: {
      "0": "× 特発性血小板減少性紫斑病（ITP） - 血小板減少は認めるが、PT・APTT延長はない。",
      "1": "× 血友病 - APTT延長は認めるが、血小板減少はない。",
      "2": "◯ 播種性血管内凝固症候群（DIC） - 血小板減少、PT・APTT延長、紫斑を認める典型的な症例。",
      "3": "× 白血病 - 血小板減少は認めるが、PT・APTT延長は通常ない。",
      "4": "× アレルギー性紫斑病 - 血小板数は正常、凝固時間も正常。"
    },
    keyLearningPoints: [
      "DICの診断基準を理解する",
      "血小板減少と凝固時間延長の組み合わせの意義",
      "小児の出血性疾患の鑑別診断"
    ],
    references: [
      "日本小児血液学会：小児DIC診療ガイドライン",
      "ISTH: DIC Diagnostic Criteria",
      "Pediatric Hematology: A Practical Guide, 3rd Edition"
    ]
  },
  {
    id: 7,
    category: "腎泌尿器",
    difficulty: "専門医レベル",
    type: "MBA",
    question: "4歳の男児。1週間前から浮腫を認める。尿蛋白（+++）、尿潜血（+）、血清アルブミン 1.8g/dL、総コレステロール 350mg/dL。この症例で適切な対応はどれか。正しいものを2つ選べ。",
    options: [
      "ステロイド療法の開始",
      "利尿薬の投与",
      "抗生剤の投与",
      "食事療法の指導",
      "腎生検の実施"
    ],
    correctAnswer: [0, 4],
    explanation: {
      "0": "◯ ステロイド療法の開始 - ネフローゼ症候群の第一選択治療。",
      "1": "× 利尿薬の投与 - 浮腫の改善には効果的だが、根本治療ではない。",
      "2": "× 抗生剤の投与 - 感染症の合併がない限り不要。",
      "3": "× 食事療法の指導 - 低塩分食は必要だが、根本治療ではない。",
      "4": "◯ 腎生検の実施 - 病理診断のため必要。"
    },
    keyLearningPoints: [
      "ネフローゼ症候群の診断基準を理解する",
      "ステロイド療法の適応",
      "腎生検の重要性"
    ],
    references: [
      "日本小児腎臓病学会：ネフローゼ症候群診療ガイドライン",
      "KDIGO: Glomerulonephritis Guidelines",
      "Pediatric Nephrology: A Comprehensive Guide"
    ]
  },
  {
    id: 8,
    category: "呼吸器",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "6歳の男児。2日前から発熱、咳嗽、呼吸困難を認める。胸部X線で右中葉の浸潤影を認める。CRP 8.5mg/dL、WBC 18,000/μL。この症例で最も適切な治療はどれか。",
    options: [
      "アモキシシリン・クラブラン酸の投与",
      "セフトリアキソンの投与",
      "アジスロマイシンの投与",
      "バンコマイシンの投与",
      "抗ウイルス薬の投与"
    ],
    correctAnswer: 1,
    explanation: {
      "0": "× アモキシシリン・クラブラン酸の投与 - 市中肺炎の第一選択だが、重症例では不十分。",
      "1": "◯ セフトリアキソンの投与 - 市中肺炎の重症例に適した第三世代セフェム系抗生剤。",
      "2": "× アジスロマイシンの投与 - 非定型肺炎の治療。細菌性肺炎には効果が限定的。",
      "3": "× バンコマイシンの投与 - MRSA感染症の治療。市中肺炎では通常不要。",
      "4": "× 抗ウイルス薬の投与 - ウイルス性肺炎の治療。細菌性肺炎には無効。"
    },
    keyLearningPoints: [
      "小児市中肺炎の重症度評価",
      "抗生剤の適切な選択",
      "細菌性肺炎とウイルス性肺炎の鑑別"
    ],
    references: [
      "日本小児科学会：小児呼吸器感染症診療ガイドライン",
      "IDSA: Pediatric Pneumonia Guidelines",
      "Pediatric Respiratory Medicine: A Comprehensive Guide"
    ]
  },
  {
    id: 9,
    category: "消化器",
    difficulty: "専門医レベル",
    type: "SBA",
    question: "生後3ヶ月の乳児。生後1ヶ月から嘔吐を繰り返し、体重増加不良を認める。腹部エコーで幽門部の肥厚を認める。この症例で最も適切な対応はどれか。",
    options: [
      "経過観察",
      "内視鏡検査の実施",
      "外科手術の実施",
      "薬物療法の開始",
      "食事指導の実施"
    ],
    correctAnswer: 2,
    explanation: {
      "0": "× 経過観察 - 放置すると脱水、電解質異常をきたす。",
      "1": "× 内視鏡検査の実施 - 診断は確定しているため不要。",
      "2": "◯ 外科手術の実施 - 肥厚性幽門狭窄症の標準治療。",
      "3": "× 薬物療法の開始 - 根本治療には無効。",
      "4": "× 食事指導の実施 - 根本治療には無効。"
    },
    keyLearningPoints: [
      "肥厚性幽門狭窄症の診断",
      "外科治療の適応",
      "乳児の嘔吐の鑑別診断"
    ],
    references: [
      "日本小児外科学会：小児消化器疾患診療ガイドライン",
      "American Pediatric Surgical Association: Guidelines",
      "Pediatric Surgery: A Comprehensive Guide"
    ]
  },
  {
    id: 10,
    category: "アレルギー",
    difficulty: "専門医レベル",
    type: "MBA",
    question: "3歳の女児。ピーナッツを食べた直後に蕁麻疹、呼吸困難、血圧低下を認める。この症例で適切な対応はどれか。正しいものを2つ選べ。",
    options: [
      "抗ヒスタミン薬の投与",
      "アドレナリンの筋肉注射",
      "ステロイドの投与",
      "酸素投与",
      "輸液の開始"
    ],
    correctAnswer: [1, 2],
    explanation: {
      "0": "× 抗ヒスタミン薬の投与 - 軽症の蕁麻疹には有効だが、アナフィラキシーには不十分。",
      "1": "◯ アドレナリンの筋肉注射 - アナフィラキシーの第一選択治療。",
      "2": "◯ ステロイドの投与 - アナフィラキシーの補助治療。",
      "3": "× 酸素投与 - 呼吸困難がある場合のみ必要。",
      "4": "× 輸液の開始 - 血圧低下がある場合のみ必要。"
    },
    keyLearningPoints: [
      "アナフィラキシーの診断",
      "アドレナリンの適応",
      "食物アレルギーの緊急対応"
    ],
    references: [
      "日本小児アレルギー学会：食物アレルギー診療ガイドライン",
      "WAO: Anaphylaxis Guidelines",
      "Pediatric Allergy: A Comprehensive Guide"
    ]
  }
];

export const categories = [
  {
    id: "neonatology",
    name: "新生児・周産期",
    description: "早産児、低出生体重児、新生児疾患、周産期管理など",
    color: "#FF6B6B"
  },
  {
    id: "cardiology",
    name: "循環器",
    description: "先天性心疾患、不整脈、心筋症、血管疾患など",
    color: "#4ECDC4"
  },
  {
    id: "endocrine",
    name: "内分泌・代謝",
    description: "甲状腺疾患、糖尿病、先天性代謝異常、副腎疾患など",
    color: "#45B7D1"
  },
  {
    id: "infection",
    name: "感染症・免疫",
    description: "細菌感染症、ウイルス感染症、真菌感染症、免疫不全症など",
    color: "#96CEB4"
  },
  {
    id: "neurology",
    name: "神経・発達",
    description: "てんかん、発達障害、神経筋疾患、脳性麻痺など",
    color: "#FFEAA7"
  },
  {
    id: "hematology",
    name: "血液・腫瘍",
    description: "貧血、白血病、リンパ腫、出血性疾患など",
    color: "#DDA0DD"
  },
  {
    id: "nephrology",
    name: "腎泌尿器",
    description: "腎炎、ネフローゼ症候群、尿路感染症、先天性腎疾患など",
    color: "#98D8C8"
  },
  {
    id: "respiratory",
    name: "呼吸器",
    description: "肺炎、喘息、気管支炎、先天性呼吸器疾患など",
    color: "#F7DC6F"
  },
  {
    id: "gastroenterology",
    name: "消化器",
    description: "胃腸炎、腸閉塞、肝炎、先天性消化器疾患など",
    color: "#BB8FCE"
  },
  {
    id: "allergy",
    name: "アレルギー",
    description: "食物アレルギー、アトピー性皮膚炎、気管支喘息など",
    color: "#F8C471"
  }
];

export const getQuestionsByCategory = (categoryId) => {
  return sampleQuestions.filter(q => q.category === categoryId);
};

export const getQuestionsByDifficulty = (difficulty) => {
  return sampleQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count = 5) => {
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getDailyQuestions = () => {
  // 今日の日付に基づいて一貫した問題を返す
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const shuffled = [...sampleQuestions].sort(() => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  });
  return shuffled.slice(0, 5);
};
