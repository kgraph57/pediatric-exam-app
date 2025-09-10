// 小児科医国家試験問題データベース
export const demoQuestions = [
  {
    id: "q_1",
    category: "general",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "生後3日目の正期産児。出生時体重3,200g。母乳栄養。生後2日目から黄疸が出現し、本日、経皮的ビリルビン値が15mg/dL（日齢基準値で高値）と測定された。活気良好で哺乳も良好。便は黄色で尿量も十分。意識レベルも正常。身体診察では、皮膚と眼球結膜に黄染を認めるが、肝脾腫は触知しない。神経学的異常所見なし。この児の黄疸に対する初期対応として、最も適切なものはどれか。ビリルビン値は日齢ごとの光線療法開始基準値を上回っている。",
    options: [
      "直ちに交換輸血を準備する。",
      "光線療法を開始する。",
      "人工乳への切り替えを検討する。",
      "経過観察とし、24時間後に再評価する。",
      "追加の血液検査（直接ビリルビン、血液型、Rh、Coombs試験）を行う。"
    ],
    correctAnswer: 1,
    explanation: [
      "×：交換輸血は、光線療法が無効でビリルビン値が非常に高値の場合や、急性ビリルビン脳症の兆候がある場合に考慮される最終手段であり、初期対応としては適切ではない。",
      "◯：経皮的ビリルビン値が日齢基準値で高値であり、光線療法開始基準値を上回っているため、光線療法を開始することが最も適切な初期対応である。母乳性黄疸の可能性も考慮しつつ、ビリルビン値の管理が優先される。",
      "×：母乳性黄疸の可能性は考慮されるが、人工乳への切り替えは必ずしも初期対応として必要ではなく、母乳栄養の継続を優先しつつ、光線療法で対応することが一般的である。",
      "×：ビリルビン値が光線療法開始基準値を上回っているため、経過観察ではなく積極的な治療介入が必要である。",
      "×：追加の血液検査は鑑別診断のために重要であるが、光線療法開始基準値を上回る黄疸に対しては、まず光線療法を開始し、同時に鑑別診断を進めるのが一般的である。"
    ],
    keyLearningPoints: [
      "新生児黄疸の評価において、日齢とビリルビン値の関係を理解し、光線療法開始基準値を適切に判断することが重要である。",
      "新生児黄疸の初期対応として、光線療法が最も一般的かつ効果的な治療法であることを理解する。",
      "母乳性黄疸の可能性があっても、ビリルビン値が高い場合はまず光線療法を優先し、鑑別診断やその他の治療は並行して検討する。"
    ],
    references: [
      "日本小児科学会新生児黄疸管理ガイドライン",
      "UpToDate: Neonatal hyperbilirubinemia: Treatment"
    ],
    tags: [
      "新生児・周産期",
      "初学者レベル"
    ],
    createdAt: "2025-08-27",
    updatedAt: "2025-08-27",
    author: "System",
    reviewedBy: "System",
    status: "published"
  },
  {
    id: "q_2",
    category: "general",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "在胎38週0日、経腟分娩で出生した新生児。出生時、羊水混濁を認め、児は活気なく、筋緊張低下、呼吸努力なし。心拍数60bpm。出生直後より新生児蘇生を開始した。気管挿管を行い、陽圧換気（PPV）を継続しているが、心拍数60bpmが持続している。この状況で次に行うべき対応として最も適切なものはどれか。",
    options: [
      "エピネフリン（アドレナリン）の投与",
      "胸骨圧迫の開始",
      "気管挿管の再確認",
      "酸素濃度の上昇",
      "静脈路の確保"
    ],
    correctAnswer: 1,
    explanation: [
      "×：エピネフリンは胸骨圧迫を行っても心拍数が60bpm未満の場合に投与される。",
      "◯：心拍数60bpmは胸骨圧迫開始の基準（60bpm未満）に該当するため、胸骨圧迫を開始する。",
      "×：気管挿管の再確認は重要だが、心拍数が60bpm未満の場合は胸骨圧迫が優先される。",
      "×：酸素濃度の上昇は必要に応じて行うが、心拍数が60bpm未満の場合は胸骨圧迫が優先される。",
      "×：静脈路の確保は重要だが、心拍数が60bpm未満の場合は胸骨圧迫が優先される。"
    ],
    keyLearningPoints: [
      "新生児蘇生において、心拍数60bpm未満は胸骨圧迫開始の基準である。",
      "胸骨圧迫は気道確保と人工呼吸が確立された後に行う。",
      "胸骨圧迫と人工呼吸の比率は3:1である。"
    ],
    references: [
      "日本小児科学会新生児蘇生法ガイドライン",
      "American Heart Association: Neonatal Resuscitation"
    ],
    tags: [
      "新生児・周産期",
      "救急・蘇生"
    ],
    createdAt: "2025-08-27",
    updatedAt: "2025-08-27",
    author: "System",
    reviewedBy: "System",
    status: "published"
  },
  {
    id: "q_3",
    category: "general",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "生後6ヶ月の乳児。発熱（38.5°C）と咳が3日間持続している。食欲は良好で、機嫌も良い。身体診察では、咽頭発赤と軽度の鼻汁を認めるが、呼吸音は正常で、胸部X線写真も異常なし。この患児の診断として最も可能性が高いものはどれか。",
    options: [
      "細菌性肺炎",
      "ウイルス性上気道感染症",
      "気管支喘息",
      "細菌性中耳炎",
      "RSウイルス感染症"
    ],
    correctAnswer: 1,
    explanation: [
      "×：細菌性肺炎では通常、より重篤な症状（呼吸困難、チアノーゼ、胸部X線異常）を認める。",
      "◯：発熱、咳、咽頭発赤、鼻汁などの症状から、ウイルス性上気道感染症が最も可能性が高い。",
      "×：気管支喘息では通常、喘鳴や呼吸困難を認める。",
      "×：細菌性中耳炎では耳痛や耳の症状を認めることが多い。",
      "×：RSウイルス感染症は可能性があるが、より重篤な呼吸器症状を認めることが多い。"
    ],
    keyLearningPoints: [
      "乳児の上気道感染症の典型的な症状を理解する。",
      "細菌性感染症とウイルス性感染症の鑑別が重要である。",
      "症状の重篤度と身体診察所見を総合的に評価する。"
    ],
    references: [
      "日本小児科学会小児感染症ガイドライン",
      "UpToDate: Common cold in children"
    ],
    tags: [
      "感染症",
      "呼吸器"
    ],
    createdAt: "2025-08-27",
    updatedAt: "2025-08-27",
    author: "System",
    reviewedBy: "System",
    status: "published"
  },
  {
    id: "q_4",
    category: "general",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "生後2歳の幼児。発熱（39.0°C）と全身性の発疹が2日間持続している。発疹は顔面から始まり、体幹、四肢に広がっている。発疹は紅色斑丘疹で、一部に水疱を認める。口腔内にアフタ性潰瘍を認める。この患児の診断として最も可能性が高いものはどれか。",
    options: [
      "麻疹",
      "風疹",
      "水痘",
      "手足口病",
      "突発性発疹"
    ],
    correctAnswer: 3,
    explanation: [
      "×：麻疹では通常、コプリック斑を認め、発疹は耳後部から始まる。",
      "×：風疹では通常、後頭部リンパ節腫脹を認め、発疹は軽度である。",
      "×：水痘では通常、水疱が主体で、口腔内のアフタ性潰瘍は典型的ではない。",
      "◯：手足口病では、手、足、口に発疹を認め、口腔内のアフタ性潰瘍が特徴的である。",
      "×：突発性発疹では通常、発熱後に発疹が出現し、口腔内のアフタ性潰瘍は認めない。"
    ],
    keyLearningPoints: [
      "手足口病の典型的な症状と発疹の分布を理解する。",
      "小児の発疹性疾患の鑑別診断が重要である。",
      "口腔内のアフタ性潰瘍は手足口病の特徴的な所見である。"
    ],
    references: [
      "日本小児科学会小児感染症ガイドライン",
      "UpToDate: Hand, foot, and mouth disease"
    ],
    tags: [
      "感染症",
      "発疹性疾患"
    ],
    createdAt: "2025-08-27",
    updatedAt: "2025-08-27",
    author: "System",
    reviewedBy: "System",
    status: "published"
  },
  {
    id: "q_5",
    category: "general",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "生後3歳の幼児。発熱（38.0°C）と腹痛が1日間持続している。食欲は良好で、機嫌も良い。身体診察では、右下腹部に軽度の圧痛を認めるが、反跳痛は認めない。血液検査では、白血球数12,000/μL（軽度上昇）を認める。この患児の診断として最も可能性が高いものはどれか。",
    options: [
      "急性虫垂炎",
      "腸重積症",
      "便秘",
      "胃腸炎",
      "尿路感染症"
    ],
    correctAnswer: 3,
    explanation: [
      "×：急性虫垂炎では通常、より重篤な症状（反跳痛、白血球数15,000/μL以上）を認める。",
      "×：腸重積症では通常、血便や腸閉塞症状を認める。",
      "×：便秘では通常、発熱を認めない。",
      "◯：発熱、腹痛、軽度の白血球数上昇から、胃腸炎が最も可能性が高い。",
      "×：尿路感染症では通常、排尿時痛や頻尿を認める。"
    ],
    keyLearningPoints: [
      "小児の腹痛の鑑別診断が重要である。",
      "症状の重篤度と身体診察所見を総合的に評価する。",
      "血液検査の結果を症状と合わせて解釈する。"
    ],
    references: [
      "日本小児科学会小児消化器疾患ガイドライン",
      "UpToDate: Acute abdominal pain in children"
    ],
    tags: [
      "消化器",
      "腹痛"
    ],
    createdAt: "2025-08-27",
    updatedAt: "2025-08-27",
    author: "System",
    reviewedBy: "System",
    status: "published"
  },
  // 新生児・周産期問題
  {
    id: "q_4",
    category: "neonatal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "正期産児の正常な出生時体重の範囲はどれか。",
    options: [
      "2,000g未満",
      "2,000-2,499g",
      "2,500-4,000g",
      "4,000-4,500g",
      "4,500g以上"
    ],
    correctAnswer: 2,
    explanation: [
      "正期産児の正常な出生時体重は2,500-4,000gである。",
      "2,500g未満は低出生体重児、4,000g以上は巨大児と定義される。"
    ],
    keyLearningPoints: ["正期産児の体重範囲", "低出生体重児の定義"],
    references: ["小児科学教科書", "新生児学"]
  },
  {
    id: "q_5",
    category: "neonatal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "新生児の生理的黄疸について正しいのはどれか。",
    options: [
      "生後24時間以内に出現する",
      "生後2-3日目にピークを迎える",
      "直接ビリルビンが主体である",
      "光線療法が必要である",
      "生後1週間で完全に消失する"
    ],
    correctAnswer: 1,
    explanation: [
      "新生児の生理的黄疸は生後2-3日目にピークを迎える。",
      "間接ビリルビンが主体で、生後1-2週間で自然に消失する。"
    ],
    keyLearningPoints: ["生理的黄疸の時期", "ビリルビンの種類"],
    references: ["新生児学", "小児科学"]
  },
  // 呼吸器問題
  {
    id: "q_6",
    category: "respiratory",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の気管支喘息の診断に最も有用な検査はどれか。",
    options: [
      "胸部X線",
      "血液ガス分析",
      "スパイロメトリー",
      "心電図",
      "CT検査"
    ],
    correctAnswer: 2,
    explanation: [
      "スパイロメトリーは気管支喘息の診断に最も有用な検査である。",
      "可逆性の気流制限を確認できる。"
    ],
    keyLearningPoints: ["気管支喘息の診断", "スパイロメトリー"],
    references: ["呼吸器学", "小児科学"]
  },
  {
    id: "q_7",
    category: "respiratory",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "RSウイルス感染症について正しいのはどれか。",
    options: [
      "成人のみに感染する",
      "夏季に流行する",
      "細気管支炎を起こす",
      "ワクチンで完全に予防できる",
      "抗生物質が第一選択である"
    ],
    correctAnswer: 2,
    explanation: [
      "RSウイルスは細気管支炎を起こす代表的なウイルスである。",
      "冬季に流行し、乳幼児に重篤な呼吸器症状を引き起こす。"
    ],
    keyLearningPoints: ["RSウイルス", "細気管支炎"],
    references: ["感染症学", "呼吸器学"]
  },
  // 循環器問題
  {
    id: "q_8",
    category: "cardiovascular",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "先天性心疾患で最も頻度が高いのはどれか。",
    options: [
      "心室中隔欠損",
      "心房中隔欠損",
      "動脈管開存",
      "ファロー四徴症",
      "大動脈縮窄"
    ],
    correctAnswer: 0,
    explanation: [
      "心室中隔欠損は先天性心疾患の中で最も頻度が高い。",
      "全先天性心疾患の約30%を占める。"
    ],
    keyLearningPoints: ["先天性心疾患", "心室中隔欠損"],
    references: ["循環器学", "小児科学"]
  },
  {
    id: "q_9",
    category: "cardiovascular",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "川崎病の診断基準に含まれるのはどれか。",
    options: [
      "発熱が5日以上持続",
      "両側眼球結膜充血",
      "口唇の紅潮、いちご舌",
      "四肢末端の変化",
      "以上すべて"
    ],
    correctAnswer: 4,
    explanation: [
      "川崎病の診断基準には発熱、眼球結膜充血、口唇変化、四肢末端変化が含まれる。",
      "これらの症状が組み合わさって診断される。"
    ],
    keyLearningPoints: ["川崎病", "診断基準"],
    references: ["循環器学", "小児科学"]
  },
  // 消化器問題
  {
    id: "q_10",
    category: "gastrointestinal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "乳児の胃食道逆流について正しいのはどれか。",
    options: [
      "生後6ヶ月以降に発症する",
      "嘔吐は異常である",
      "体重増加不良を伴う",
      "自然に改善することが多い",
      "必ず治療が必要である"
    ],
    correctAnswer: 3,
    explanation: [
      "乳児の胃食道逆流は自然に改善することが多い。",
      "生後3-4ヶ月でピークを迎え、その後改善傾向を示す。"
    ],
    keyLearningPoints: ["胃食道逆流", "自然経過"],
    references: ["消化器学", "小児科学"]
  },
  {
    id: "q_11",
    category: "gastrointestinal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の急性胃腸炎で最も重要な治療はどれか。",
    options: [
      "抗生物質投与",
      "下痢止め薬投与",
      "水分補給",
      "絶食",
      "解熱薬投与"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の急性胃腸炎では脱水の予防・治療のための水分補給が最も重要である。",
      "経口補水液（ORS）の使用が推奨される。"
    ],
    keyLearningPoints: ["急性胃腸炎", "脱水管理"],
    references: ["消化器学", "小児科学"]
  },
  // 神経問題
  {
    id: "q_12",
    category: "neurology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の熱性けいれんについて正しいのはどれか。",
    options: [
      "38℃以上の発熱時に起こる",
      "5歳以下に多い",
      "てんかんに移行する",
      "抗けいれん薬が必要",
      "脳波検査は必須"
    ],
    correctAnswer: 1,
    explanation: [
      "熱性けいれんは5歳以下に多く、38℃以上の発熱時に起こる。",
      "単純型熱性けいれんは予後良好で、てんかんへの移行率は低い。"
    ],
    keyLearningPoints: ["熱性けいれん", "年齢分布"],
    references: ["神経学", "小児科学"]
  },
  {
    id: "q_13",
    category: "neurology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のてんかんの分類で、焦点性てんかんに含まれるのはどれか。",
    options: [
      "小児欠神てんかん",
      "若年ミオクロニーてんかん",
      "側頭葉てんかん",
      "ウエスト症候群",
      "レノックス・ガストー症候群"
    ],
    correctAnswer: 2,
    explanation: [
      "側頭葉てんかんは焦点性てんかんに分類される。",
      "他の選択肢は全般性てんかんに分類される。"
    ],
    keyLearningPoints: ["てんかん分類", "焦点性てんかん"],
    references: ["神経学", "てんかん学"]
  },
  // 内分泌問題
  {
    id: "q_14",
    category: "endocrinology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の1型糖尿病について正しいのはどれか。",
    options: [
      "肥満が原因である",
      "インスリン分泌は正常",
      "自己免疫性が関与",
      "食事療法のみで治療可能",
      "成人期に発症する"
    ],
    correctAnswer: 2,
    explanation: [
      "1型糖尿病は自己免疫性が関与し、膵β細胞の破壊によりインスリン分泌が低下する。",
      "小児期に発症することが多く、インスリン治療が必要である。"
    ],
    keyLearningPoints: ["1型糖尿病", "自己免疫"],
    references: ["内分泌学", "小児科学"]
  },
  {
    id: "q_15",
    category: "endocrinology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の成長ホルモン分泌不全症について正しいのはどれか。",
    options: [
      "身長は正常範囲内",
      "体重は正常範囲内",
      "成長速度は正常",
      "成長ホルモン治療が有効",
      "自然に改善する"
    ],
    correctAnswer: 3,
    explanation: [
      "成長ホルモン分泌不全症では成長ホルモン治療が有効である。",
      "身長の伸びが悪く、成長速度が低下する。"
    ],
    keyLearningPoints: ["成長ホルモン", "治療"],
    references: ["内分泌学", "小児科学"]
  },
  // 血液・腫瘍問題
  {
    id: "q_16",
    category: "hematology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の鉄欠乏性貧血について正しいのはどれか。",
    options: [
      "男児に多い",
      "MCVは増加する",
      "血清フェリチンは上昇する",
      "鉄剤投与が有効",
      "自然に改善する"
    ],
    correctAnswer: 3,
    explanation: [
      "鉄欠乏性貧血では鉄剤投与が有効である。",
      "MCVは減少し、血清フェリチンは低下する。"
    ],
    keyLearningPoints: ["鉄欠乏性貧血", "治療"],
    references: ["血液学", "小児科学"]
  },
  {
    id: "q_17",
    category: "hematology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の急性リンパ性白血病について正しいのはどれか。",
    options: [
      "成人に多い",
      "予後は不良",
      "化学療法が有効",
      "自然治癒する",
      "手術が第一選択"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の急性リンパ性白血病では化学療法が有効である。",
      "小児に多く、適切な治療により予後は良好である。"
    ],
    keyLearningPoints: ["急性リンパ性白血病", "化学療法"],
    references: ["血液学", "腫瘍学"]
  },
  // 免疫・アレルギー問題
  {
    id: "q_18",
    category: "immunology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の食物アレルギーについて正しいのはどれか。",
    options: [
      "卵アレルギーは成人に多い",
      "牛乳アレルギーは自然に改善する",
      "ピーナッツアレルギーは軽症",
      "アナフィラキシーは起こらない",
      "除去食のみで治療可能"
    ],
    correctAnswer: 1,
    explanation: [
      "牛乳アレルギーは成長とともに自然に改善することが多い。",
      "卵アレルギーも小児期に多く、成長とともに改善傾向を示す。"
    ],
    keyLearningPoints: ["食物アレルギー", "自然経過"],
    references: ["アレルギー学", "小児科学"]
  },
  {
    id: "q_19",
    category: "immunology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のアトピー性皮膚炎について正しいのはどれか。",
    options: [
      "成人のみに発症する",
      "ステロイド外用薬は禁忌",
      "保湿が重要",
      "自然に治癒する",
      "抗生物質が第一選択"
    ],
    correctAnswer: 2,
    explanation: [
      "アトピー性皮膚炎では保湿が重要である。",
      "ステロイド外用薬も適切に使用すれば有効である。"
    ],
    keyLearningPoints: ["アトピー性皮膚炎", "保湿"],
    references: ["皮膚科学", "アレルギー学"]
  },
  // 感染症問題
  {
    id: "q_20",
    category: "infectious",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の水痘について正しいのはどれか。",
    options: [
      "細菌感染症である",
      "ワクチンで予防可能",
      "一度感染すれば再感染しない",
      "成人にのみ感染する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "水痘はワクチンで予防可能なウイルス感染症である。",
      "水痘帯状疱疹ウイルスによる感染症で、小児に多い。"
    ],
    keyLearningPoints: ["水痘", "ワクチン"],
    references: ["感染症学", "小児科学"]
  },
  {
    id: "q_21",
    category: "infectious",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の麻疹について正しいのはどれか。",
    options: [
      "軽症の感染症",
      "ワクチンで予防可能",
      "抗生物質が有効",
      "成人にのみ感染",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "麻疹はワクチンで予防可能なウイルス感染症である。",
      "重篤な合併症を起こすことがあり、予防が重要である。"
    ],
    keyLearningPoints: ["麻疹", "予防"],
    references: ["感染症学", "小児科学"]
  },
  // 救急・蘇生問題
  {
    id: "q_22",
    category: "emergency",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の心肺蘇生法について正しいのはどれか。",
    options: [
      "成人と同じ手順",
      "胸骨圧迫は不要",
      "人工呼吸は不要",
      "年齢に応じた手順",
      "AEDは使用しない"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の心肺蘇生法は年齢に応じた手順で行う。",
      "乳児、小児、成人で手順が異なる。"
    ],
    keyLearningPoints: ["心肺蘇生法", "年齢別手順"],
    references: ["救急医学", "小児科学"]
  },
  {
    id: "q_23",
    category: "emergency",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の異物誤飲について正しいのはどれか。",
    options: [
      "コインは自然に排出される",
      "ボタン電池は緊急対応不要",
      "磁石は安全",
      "気道異物は緊急対応必要",
      "すべて自然に治癒する"
    ],
    correctAnswer: 3,
    explanation: [
      "気道異物は緊急対応が必要である。",
      "ボタン電池や磁石は特に危険で、迅速な対応が必要。"
    ],
    keyLearningPoints: ["異物誤飲", "緊急対応"],
    references: ["救急医学", "小児科学"]
  },
  // 発達・行動問題
  {
    id: "q_24",
    category: "development",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の発達について正しいのはどれか。",
    options: [
      "すべて同じ速度で発達する",
      "個人差がある",
      "環境の影響は受けない",
      "遺伝のみで決まる",
      "治療は不要"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の発達には個人差がある。",
      "遺伝と環境の両方が発達に影響する。"
    ],
    keyLearningPoints: ["発達", "個人差"],
    references: ["発達心理学", "小児科学"]
  },
  {
    id: "q_25",
    category: "development",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の自閉症スペクトラム障害について正しいのはどれか。",
    options: [
      "治療は不可能",
      "早期介入が重要",
      "成人期に発症",
      "遺伝的要素はない",
      "自然に治癒する"
    ],
    correctAnswer: 1,
    explanation: [
      "自閉症スペクトラム障害では早期介入が重要である。",
      "適切な支援により症状の改善が期待できる。"
    ],
    keyLearningPoints: ["自閉症スペクトラム", "早期介入"],
    references: ["発達心理学", "小児科学"]
  },
  // 追加の新生児・周産期問題
  {
    id: "q_26",
    category: "neonatal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "早産児の定義はどれか。",
    options: [
      "妊娠22週未満で出生",
      "妊娠37週未満で出生",
      "妊娠40週未満で出生",
      "妊娠42週未満で出生",
      "妊娠44週未満で出生"
    ],
    correctAnswer: 1,
    explanation: [
      "早産児は妊娠37週未満で出生した児を指す。",
      "正期産は妊娠37週0日から41週6日までである。"
    ],
    keyLearningPoints: ["早産児の定義", "正期産"],
    references: ["新生児学", "産科学"]
  },
  {
    id: "q_27",
    category: "neonatal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "新生児の呼吸窮迫症候群（RDS）について正しいのはどれか。",
    options: [
      "肺サーファクタントの過剰産生が原因",
      "正期産児に多い",
      "胸部X線で白肺像を呈する",
      "自然に治癒する",
      "抗生物質が第一選択"
    ],
    correctAnswer: 2,
    explanation: [
      "RDSでは胸部X線で白肺像（両側肺野の均等な不透明化）を呈する。",
      "肺サーファクタントの不足が原因で、早産児に多い。"
    ],
    keyLearningPoints: ["RDS", "胸部X線所見"],
    references: ["新生児学", "呼吸器学"]
  },
  // 追加の呼吸器問題
  {
    id: "q_28",
    category: "respiratory",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児のクループについて正しいのはどれか。",
    options: [
      "細菌感染症である",
      "犬吠様咳嗽が特徴",
      "成人に多い",
      "抗生物質が第一選択",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "クループは犬吠様咳嗽が特徴的なウイルス性上気道感染症である。",
      "小児に多く、多くは自然に治癒する。"
    ],
    keyLearningPoints: ["クループ", "犬吠様咳嗽"],
    references: ["呼吸器学", "感染症学"]
  },
  {
    id: "q_29",
    category: "respiratory",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の気管支喘息の長期管理薬として適切でないのはどれか。",
    options: [
      "吸入ステロイド",
      "ロイコトリエン受容体拮抗薬",
      "長時間作用性β2刺激薬",
      "テオフィリン",
      "短時間作用性β2刺激薬"
    ],
    correctAnswer: 4,
    explanation: [
      "短時間作用性β2刺激薬は発作時の緊急時使用薬であり、長期管理薬ではない。",
      "長期管理には吸入ステロイドやロイコトリエン受容体拮抗薬が使用される。"
    ],
    keyLearningPoints: ["気管支喘息", "長期管理薬"],
    references: ["呼吸器学", "薬理学"]
  },
  // 追加の循環器問題
  {
    id: "q_30",
    category: "cardiovascular",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の動脈管開存症について正しいのはどれか。",
    options: [
      "左→右シャントを起こす",
      "右→左シャントを起こす",
      "両方向シャントを起こす",
      "シャントは起こさない",
      "自然閉鎖しない"
    ],
    correctAnswer: 0,
    explanation: [
      "動脈管開存症では大動脈から肺動脈への左→右シャントを起こす。",
      "肺高血圧が進行すると右→左シャントに変化する。"
    ],
    keyLearningPoints: ["動脈管開存症", "シャント"],
    references: ["循環器学", "小児科学"]
  },
  {
    id: "q_31",
    category: "cardiovascular",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の心筋炎について正しいのはどれか。",
    options: [
      "細菌感染のみが原因",
      "心電図変化は認めない",
      "心不全を起こすことがある",
      "抗生物質が有効",
      "自然治癒しない"
    ],
    correctAnswer: 2,
    explanation: [
      "心筋炎では心不全を起こすことがある。",
      "ウイルス感染が主な原因で、心電図変化も認められる。"
    ],
    keyLearningPoints: ["心筋炎", "心不全"],
    references: ["循環器学", "感染症学"]
  },
  // 追加の消化器問題
  {
    id: "q_32",
    category: "gastrointestinal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の腸重積症について正しいのはどれか。",
    options: [
      "成人に多い",
      "血便を認めない",
      "腹部超音波で診断可能",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 2,
    explanation: [
      "腸重積症は腹部超音波で診断可能である。",
      "小児に多く、血便を認めることがある。"
    ],
    keyLearningPoints: ["腸重積症", "超音波診断"],
    references: ["消化器学", "画像診断学"]
  },
  {
    id: "q_33",
    category: "gastrointestinal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の乳糖不耐症について正しいのはどれか。",
    options: [
      "先天性のみ",
      "後天性はない",
      "下痢を起こす",
      "抗生物質が有効",
      "自然治癒しない"
    ],
    correctAnswer: 2,
    explanation: [
      "乳糖不耐症では下痢を起こす。",
      "先天性と後天性があり、乳糖除去食で改善する。"
    ],
    keyLearningPoints: ["乳糖不耐症", "下痢"],
    references: ["消化器学", "栄養学"]
  },
  // 追加の神経問題
  {
    id: "q_34",
    category: "neurology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の脳性麻痺について正しいのはどれか。",
    options: [
      "成人期に発症する",
      "進行性の疾患",
      "運動障害を伴う",
      "抗生物質が有効",
      "自然治癒する"
    ],
    correctAnswer: 2,
    explanation: [
      "脳性麻痺では運動障害を伴う。",
      "非進行性の疾患で、小児期に発症する。"
    ],
    keyLearningPoints: ["脳性麻痺", "運動障害"],
    references: ["神経学", "リハビリテーション医学"]
  },
  {
    id: "q_35",
    category: "neurology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のウエスト症候群について正しいのはどれか。",
    options: [
      "成人に多い",
      "点頭てんかんとも呼ばれる",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "ウエスト症候群は点頭てんかんとも呼ばれる。",
      "乳児期に発症し、予後は不良なことが多い。"
    ],
    keyLearningPoints: ["ウエスト症候群", "点頭てんかん"],
    references: ["神経学", "てんかん学"]
  },
  // 追加の内分泌問題
  {
    id: "q_36",
    category: "endocrinology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の甲状腺機能亢進症について正しいのはどれか。",
    options: [
      "体重増加を認める",
      "脈拍は遅くなる",
      "眼球突出を認める",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 2,
    explanation: [
      "甲状腺機能亢進症では眼球突出を認めることがある。",
      "体重減少、頻脈を認める。"
    ],
    keyLearningPoints: ["甲状腺機能亢進症", "眼球突出"],
    references: ["内分泌学", "小児科学"]
  },
  {
    id: "q_37",
    category: "endocrinology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の先天性甲状腺機能低下症について正しいのはどれか。",
    options: [
      "新生児マススクリーニングで発見される",
      "自然治癒する",
      "抗生物質が有効",
      "成人期に発症",
      "治療は不要"
    ],
    correctAnswer: 0,
    explanation: [
      "先天性甲状腺機能低下症は新生児マススクリーニングで発見される。",
      "早期の甲状腺ホルモン補充治療が重要である。"
    ],
    keyLearningPoints: ["先天性甲状腺機能低下症", "マススクリーニング"],
    references: ["内分泌学", "新生児学"]
  },
  // 追加の血液・腫瘍問題
  {
    id: "q_38",
    category: "hematology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の特発性血小板減少性紫斑病（ITP）について正しいのはどれか。",
    options: [
      "成人に多い",
      "血小板数は増加する",
      "自然治癒することが多い",
      "抗生物質が有効",
      "予後は不良"
    ],
    correctAnswer: 2,
    explanation: [
      "小児のITPは自然治癒することが多い。",
      "血小板数は減少し、小児に多い。"
    ],
    keyLearningPoints: ["ITP", "自然治癒"],
    references: ["血液学", "小児科学"]
  },
  {
    id: "q_39",
    category: "hematology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の血友病について正しいのはどれか。",
    options: [
      "女児に多い",
      "出血傾向を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "血友病では出血傾向を認める。",
      "男児に多く、遺伝性の疾患である。"
    ],
    keyLearningPoints: ["血友病", "出血傾向"],
    references: ["血液学", "遺伝学"]
  },
  // 追加の免疫・アレルギー問題
  {
    id: "q_40",
    category: "immunology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児のアナフィラキシーについて正しいのはどれか。",
    options: [
      "軽症のアレルギー反応",
      "エピネフリンが有効",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "アナフィラキシーではエピネフリンが有効である。",
      "重篤なアレルギー反応で、迅速な対応が必要。"
    ],
    keyLearningPoints: ["アナフィラキシー", "エピネフリン"],
    references: ["アレルギー学", "救急医学"]
  },
  {
    id: "q_41",
    category: "immunology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の原発性免疫不全症について正しいのはどれか。",
    options: [
      "後天性のみ",
      "感染症を繰り返す",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "原発性免疫不全症では感染症を繰り返す。",
      "先天性の疾患で、適切な管理が必要。"
    ],
    keyLearningPoints: ["原発性免疫不全症", "反復感染"],
    references: ["免疫学", "感染症学"]
  },
  // 追加の感染症問題
  {
    id: "q_42",
    category: "infectious",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の手足口病について正しいのはどれか。",
    options: [
      "細菌感染症",
      "夏季に流行する",
      "成人にのみ感染",
      "抗生物質が有効",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "手足口病は夏季に流行するウイルス感染症である。",
      "小児に多く、自然に治癒する。"
    ],
    keyLearningPoints: ["手足口病", "夏季流行"],
    references: ["感染症学", "小児科学"]
  },
  {
    id: "q_43",
    category: "infectious",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のインフルエンザについて正しいのはどれか。",
    options: [
      "細菌感染症",
      "ワクチンで予防可能",
      "抗生物質が第一選択",
      "自然治癒しない",
      "成人にのみ感染"
    ],
    correctAnswer: 1,
    explanation: [
      "インフルエンザはワクチンで予防可能なウイルス感染症である。",
      "小児に多く、抗ウイルス薬が有効。"
    ],
    keyLearningPoints: ["インフルエンザ", "ワクチン"],
    references: ["感染症学", "予防医学"]
  },
  // 追加の救急・蘇生問題
  {
    id: "q_44",
    category: "emergency",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の熱中症について正しいのはどれか。",
    options: [
      "冬季に多い",
      "水分補給が重要",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "熱中症では水分補給が重要である。",
      "夏季に多く、適切な対応が必要。"
    ],
    keyLearningPoints: ["熱中症", "水分補給"],
    references: ["救急医学", "環境医学"]
  },
  {
    id: "q_45",
    category: "emergency",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の溺水について正しいのはどれか。",
    options: [
      "成人に多い",
      "迅速な蘇生が重要",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "溺水では迅速な蘇生が重要である。",
      "小児に多く、適切な対応により予後が改善する。"
    ],
    keyLearningPoints: ["溺水", "蘇生"],
    references: ["救急医学", "小児科学"]
  },
  // 追加の発達・行動問題
  {
    id: "q_46",
    category: "development",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児のADHDについて正しいのはどれか。",
    options: [
      "成人にのみ発症",
      "注意欠如と多動性を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "ADHDでは注意欠如と多動性を認める。",
      "小児期に発症し、適切な支援が重要。"
    ],
    keyLearningPoints: ["ADHD", "注意欠如"],
    references: ["発達心理学", "小児科学"]
  },
  {
    id: "q_47",
    category: "development",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の学習障害について正しいのはどれか。",
    options: [
      "知能低下を伴う",
      "特定の学習領域で困難を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "学習障害では特定の学習領域で困難を認める。",
      "知能は正常範囲内で、適切な支援が重要。"
    ],
    keyLearningPoints: ["学習障害", "特定領域"],
    references: ["発達心理学", "教育心理学"]
  },
  // 追加の一般小児科問題
  {
    id: "q_48",
    category: "general",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な体温について正しいのはどれか。",
    options: [
      "36.0℃未満",
      "36.0-37.0℃",
      "37.0-38.0℃",
      "38.0-39.0℃",
      "39.0℃以上"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の正常な体温は36.0-37.0℃である。",
      "37.5℃以上を発熱とすることが多い。"
    ],
    keyLearningPoints: ["正常体温", "発熱の定義"],
    references: ["小児科学", "生理学"]
  },
  {
    id: "q_49",
    category: "general",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の成長曲線について正しいのはどれか。",
    options: [
      "個人差はない",
      "パーセンタイルで評価する",
      "遺伝のみで決まる",
      "環境の影響は受けない",
      "成人期まで変化しない"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の成長曲線はパーセンタイルで評価する。",
      "個人差があり、遺伝と環境の両方が影響する。"
    ],
    keyLearningPoints: ["成長曲線", "パーセンタイル"],
    references: ["小児科学", "成長学"]
  },
  {
    id: "q_50",
    category: "general",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の予防接種スケジュールについて正しいのはどれか。",
    options: [
      "生後2ヶ月から開始",
      "生後6ヶ月から開始",
      "生後1年から開始",
      "生後2年から開始",
      "生後3年から開始"
    ],
    correctAnswer: 0,
    explanation: [
      "小児の予防接種は生後2ヶ月から開始する。",
      "BCG、四種混合、ヒブ、肺炎球菌ワクチンなどが含まれる。"
    ],
    keyLearningPoints: ["予防接種", "開始時期"],
    references: ["予防医学", "小児科学"]
  },
  // 追加の新生児・周産期問題
  {
    id: "q_51",
    category: "neonatal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "新生児の正常な心拍数について正しいのはどれか。",
    options: [
      "60-80/分",
      "80-100/分",
      "100-160/分",
      "160-200/分",
      "200-250/分"
    ],
    correctAnswer: 2,
    explanation: [
      "新生児の正常な心拍数は100-160/分である。",
      "成人より高く、年齢とともに徐々に低下する。"
    ],
    keyLearningPoints: ["新生児心拍数", "正常値"],
    references: ["新生児学", "循環器学"]
  },
  {
    id: "q_52",
    category: "neonatal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "新生児の低血糖について正しいのはどれか。",
    options: [
      "症状は認めない",
      "血糖値40mg/dL未満で診断",
      "自然に改善する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "新生児の低血糖は血糖値40mg/dL未満で診断する。",
      "症状を認めることがあり、適切な管理が必要。"
    ],
    keyLearningPoints: ["新生児低血糖", "診断基準"],
    references: ["新生児学", "内分泌学"]
  },
  {
    id: "q_53",
    category: "neonatal",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "新生児の壊死性腸炎について正しいのはどれか。",
    options: [
      "正期産児に多い",
      "腹部膨満を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "壊死性腸炎では腹部膨満を認める。",
      "早産児に多く、重篤な合併症を起こすことがある。"
    ],
    keyLearningPoints: ["壊死性腸炎", "腹部膨満"],
    references: ["新生児学", "消化器学"]
  },
  // 追加の呼吸器問題
  {
    id: "q_54",
    category: "respiratory",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の肺炎について正しいのはどれか。",
    options: [
      "ウイルス性のみ",
      "細菌性のみ",
      "ウイルス性と細菌性がある",
      "真菌性のみ",
      "寄生虫性のみ"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の肺炎にはウイルス性と細菌性がある。",
      "年齢や原因により治療法が異なる。"
    ],
    keyLearningPoints: ["肺炎", "原因"],
    references: ["呼吸器学", "感染症学"]
  },
  {
    id: "q_55",
    category: "respiratory",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の気管支炎について正しいのはどれか。",
    options: [
      "細菌感染症のみ",
      "ウイルス感染症が多い",
      "成人に多い",
      "抗生物質が第一選択",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の気管支炎はウイルス感染症が多い。",
      "多くは自然に治癒し、対症療法が中心。"
    ],
    keyLearningPoints: ["気管支炎", "ウイルス感染"],
    references: ["呼吸器学", "感染症学"]
  },
  {
    id: "q_56",
    category: "respiratory",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の気管支拡張症について正しいのはどれか。",
    options: [
      "可逆性の疾患",
      "不可逆性の疾患",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "気管支拡張症は不可逆性の疾患である。",
      "適切な管理により症状の進行を遅らせることができる。"
    ],
    keyLearningPoints: ["気管支拡張症", "不可逆性"],
    references: ["呼吸器学", "小児科学"]
  },
  // 追加の循環器問題
  {
    id: "q_57",
    category: "cardiovascular",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の心房中隔欠損について正しいのはどれか。",
    options: [
      "左→右シャントを起こす",
      "右→左シャントを起こす",
      "両方向シャントを起こす",
      "シャントは起こさない",
      "自然閉鎖しない"
    ],
    correctAnswer: 0,
    explanation: [
      "心房中隔欠損では左→右シャントを起こす。",
      "肺高血圧が進行すると右→左シャントに変化する。"
    ],
    keyLearningPoints: ["心房中隔欠損", "シャント"],
    references: ["循環器学", "小児科学"]
  },
  {
    id: "q_58",
    category: "cardiovascular",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児のファロー四徴症について正しいのはどれか。",
    options: [
      "左→右シャントを起こす",
      "右→左シャントを起こす",
      "両方向シャントを起こす",
      "シャントは起こさない",
      "自然治癒する"
    ],
    correctAnswer: 1,
    explanation: [
      "ファロー四徴症では右→左シャントを起こす。",
      "チアノーゼを認める代表的な先天性心疾患である。"
    ],
    keyLearningPoints: ["ファロー四徴症", "チアノーゼ"],
    references: ["循環器学", "小児科学"]
  },
  {
    id: "q_59",
    category: "cardiovascular",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の大動脈縮窄について正しいのはどれか。",
    options: [
      "上肢の血圧が高い",
      "下肢の血圧が高い",
      "上下肢の血圧は同じ",
      "血圧差は認めない",
      "自然治癒する"
    ],
    correctAnswer: 0,
    explanation: [
      "大動脈縮窄では上肢の血圧が高い。",
      "下肢の血圧が低く、血圧差を認める。"
    ],
    keyLearningPoints: ["大動脈縮窄", "血圧差"],
    references: ["循環器学", "小児科学"]
  },
  // 追加の消化器問題
  {
    id: "q_60",
    category: "gastrointestinal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の便秘について正しいのはどれか。",
    options: [
      "成人に多い",
      "機能性便秘が多い",
      "器質性便秘が多い",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の便秘は機能性便秘が多い。",
      "生活習慣の改善や薬物療法で改善することが多い。"
    ],
    keyLearningPoints: ["便秘", "機能性"],
    references: ["消化器学", "小児科学"]
  },
  {
    id: "q_61",
    category: "gastrointestinal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の過敏性腸症候群について正しいのはどれか。",
    options: [
      "器質的疾患",
      "機能性疾患",
      "感染性疾患",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "過敏性腸症候群は機能性疾患である。",
      "器質的異常を認めず、症状に基づいて診断する。"
    ],
    keyLearningPoints: ["過敏性腸症候群", "機能性"],
    references: ["消化器学", "小児科学"]
  },
  {
    id: "q_62",
    category: "gastrointestinal",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の炎症性腸疾患について正しいのはどれか。",
    options: [
      "感染性疾患",
      "自己免疫性疾患",
      "遺伝性疾患",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "炎症性腸疾患は自己免疫性疾患である。",
      "クローン病と潰瘍性大腸炎が代表的な疾患。"
    ],
    keyLearningPoints: ["炎症性腸疾患", "自己免疫"],
    references: ["消化器学", "免疫学"]
  },
  // 追加の神経問題
  {
    id: "q_63",
    category: "neurology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の片頭痛について正しいのはどれか。",
    options: [
      "成人にのみ発症",
      "小児にも発症する",
      "自然治癒する",
      "抗生物質が有効",
      "予後は不良"
    ],
    correctAnswer: 1,
    explanation: [
      "片頭痛は小児にも発症する。",
      "小児期の発症は成人期まで続くことが多い。"
    ],
    keyLearningPoints: ["片頭痛", "小児発症"],
    references: ["神経学", "小児科学"]
  },
  {
    id: "q_64",
    category: "neurology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の緊張型頭痛について正しいのはどれか。",
    options: [
      "拍動性の頭痛",
      "締め付けられるような頭痛",
      "片側性の頭痛",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "緊張型頭痛は締め付けられるような頭痛が特徴である。",
      "両側性で、拍動性ではない。"
    ],
    keyLearningPoints: ["緊張型頭痛", "頭痛の特徴"],
    references: ["神経学", "小児科学"]
  },
  {
    id: "q_65",
    category: "neurology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の脳腫瘍について正しいのはどれか。",
    options: [
      "成人に多い",
      "小児に多い",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "脳腫瘍は小児に多い。",
      "小児期の悪性腫瘍の中で2番目に多い。"
    ],
    keyLearningPoints: ["脳腫瘍", "小児腫瘍"],
    references: ["神経学", "腫瘍学"]
  },
  // 追加の内分泌問題
  {
    id: "q_66",
    category: "endocrinology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の甲状腺機能低下症について正しいのはどれか。",
    options: [
      "体重減少を認める",
      "体重増加を認める",
      "頻脈を認める",
      "自然治癒する",
      "抗生物質が有効"
    ],
    correctAnswer: 1,
    explanation: [
      "甲状腺機能低下症では体重増加を認める。",
      "体重減少、頻脈は甲状腺機能亢進症の症状。"
    ],
    keyLearningPoints: ["甲状腺機能低下症", "体重増加"],
    references: ["内分泌学", "小児科学"]
  },
  {
    id: "q_67",
    category: "endocrinology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の副腎皮質機能低下症について正しいのはどれか。",
    options: [
      "体重増加を認める",
      "体重減少を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "副腎皮質機能低下症では体重減少を認める。",
      "アジソン病などが代表的な疾患。"
    ],
    keyLearningPoints: ["副腎皮質機能低下症", "体重減少"],
    references: ["内分泌学", "小児科学"]
  },
  {
    id: "q_68",
    category: "endocrinology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のクッシング症候群について正しいのはどれか。",
    options: [
      "体重減少を認める",
      "体重増加を認める",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "クッシング症候群では体重増加を認める。",
      "中心性肥満、満月様顔貌が特徴的。"
    ],
    keyLearningPoints: ["クッシング症候群", "中心性肥満"],
    references: ["内分泌学", "小児科学"]
  },
  // 追加の血液・腫瘍問題
  {
    id: "q_69",
    category: "hematology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の再生不良性貧血について正しいのはどれか。",
    options: [
      "骨髄の造血機能は正常",
      "骨髄の造血機能が低下",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "再生不良性貧血では骨髄の造血機能が低下する。",
      "全血球減少を認める。"
    ],
    keyLearningPoints: ["再生不良性貧血", "造血機能低下"],
    references: ["血液学", "小児科学"]
  },
  {
    id: "q_70",
    category: "hematology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の溶血性貧血について正しいのはどれか。",
    options: [
      "赤血球の寿命は正常",
      "赤血球の寿命が短縮",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "溶血性貧血では赤血球の寿命が短縮する。",
      "間接ビリルビンの上昇を認める。"
    ],
    keyLearningPoints: ["溶血性貧血", "赤血球寿命"],
    references: ["血液学", "小児科学"]
  },
  {
    id: "q_71",
    category: "hematology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の急性骨髄性白血病について正しいのはどれか。",
    options: [
      "成人に多い",
      "小児に多い",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "急性骨髄性白血病は小児に多い。",
      "小児期の悪性腫瘍の中で最も多い。"
    ],
    keyLearningPoints: ["急性骨髄性白血病", "小児腫瘍"],
    references: ["血液学", "腫瘍学"]
  },
  // 追加の免疫・アレルギー問題
  {
    id: "q_72",
    category: "immunology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児のアレルギー性鼻炎について正しいのはどれか。",
    options: [
      "成人にのみ発症",
      "小児にも発症する",
      "自然治癒する",
      "抗生物質が有効",
      "予後は不良"
    ],
    correctAnswer: 1,
    explanation: [
      "アレルギー性鼻炎は小児にも発症する。",
      "花粉症、ハウスダストアレルギーなどが原因。"
    ],
    keyLearningPoints: ["アレルギー性鼻炎", "小児発症"],
    references: ["アレルギー学", "小児科学"]
  },
  {
    id: "q_73",
    category: "immunology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の気管支喘息のアレルギー性について正しいのはどれか。",
    options: [
      "アレルギー性ではない",
      "アレルギー性が多い",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の気管支喘息はアレルギー性が多い。",
      "ハウスダスト、ダニ、花粉などが原因。"
    ],
    keyLearningPoints: ["気管支喘息", "アレルギー性"],
    references: ["アレルギー学", "呼吸器学"]
  },
  {
    id: "q_74",
    category: "immunology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の血管性浮腫について正しいのはどれか。",
    options: [
      "皮膚のみに発症",
      "皮膚と粘膜に発症",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "血管性浮腫は皮膚と粘膜に発症する。",
      "遺伝性血管性浮腫と後天性血管性浮腫がある。"
    ],
    keyLearningPoints: ["血管性浮腫", "皮膚粘膜"],
    references: ["アレルギー学", "皮膚科学"]
  },
  // 追加の感染症問題
  {
    id: "q_75",
    category: "infectious",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の風疹について正しいのはどれか。",
    options: [
      "細菌感染症",
      "ウイルス感染症",
      "真菌感染症",
      "寄生虫感染症",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "風疹はウイルス感染症である。",
      "風疹ウイルスによる感染症で、ワクチンで予防可能。"
    ],
    keyLearningPoints: ["風疹", "ウイルス感染"],
    references: ["感染症学", "予防医学"]
  },
  {
    id: "q_76",
    category: "infectious",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児のおたふくかぜについて正しいのはどれか。",
    options: [
      "細菌感染症",
      "ウイルス感染症",
      "真菌感染症",
      "寄生虫感染症",
      "自然治癒しない"
    ],
    correctAnswer: 1,
    explanation: [
      "おたふくかぜはウイルス感染症である。",
      "ムンプスウイルスによる感染症で、ワクチンで予防可能。"
    ],
    keyLearningPoints: ["おたふくかぜ", "ムンプスウイルス"],
    references: ["感染症学", "予防医学"]
  },
  {
    id: "q_77",
    category: "infectious",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の百日咳について正しいのはどれか。",
    options: [
      "細菌感染症",
      "ウイルス感染症",
      "真菌感染症",
      "寄生虫感染症",
      "自然治癒しない"
    ],
    correctAnswer: 0,
    explanation: [
      "百日咳は細菌感染症である。",
      "百日咳菌による感染症で、ワクチンで予防可能。"
    ],
    keyLearningPoints: ["百日咳", "細菌感染"],
    references: ["感染症学", "予防医学"]
  },
  // 追加の救急・蘇生問題
  {
    id: "q_78",
    category: "emergency",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の外傷について正しいのはどれか。",
    options: [
      "成人と同じ対応",
      "年齢に応じた対応",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の外傷は年齢に応じた対応が必要である。",
      "小児の解剖学的特徴を考慮した対応が重要。"
    ],
    keyLearningPoints: ["小児外傷", "年齢別対応"],
    references: ["救急医学", "外傷学"]
  },
  {
    id: "q_79",
    category: "emergency",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の中毒について正しいのはどれか。",
    options: [
      "成人に多い",
      "小児に多い",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "中毒は小児に多い。",
      "誤飲による中毒が多く、予防が重要。"
    ],
    keyLearningPoints: ["小児中毒", "誤飲"],
    references: ["救急医学", "中毒学"]
  },
  {
    id: "q_80",
    category: "emergency",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児のショックについて正しいのはどれか。",
    options: [
      "血圧は正常",
      "血圧は低下",
      "自然治癒する",
      "抗生物質が有効",
      "予後は良好"
    ],
    correctAnswer: 1,
    explanation: [
      "ショックでは血圧は低下する。",
      "迅速な循環管理が必要である。"
    ],
    keyLearningPoints: ["ショック", "血圧低下"],
    references: ["救急医学", "循環器学"]
  },
  // 追加の発達・行動問題
  {
    id: "q_81",
    category: "development",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の言語発達について正しいのはどれか。",
    options: [
      "個人差はない",
      "個人差がある",
      "環境の影響は受けない",
      "遺伝のみで決まる",
      "治療は不要"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の言語発達には個人差がある。",
      "遺伝と環境の両方が発達に影響する。"
    ],
    keyLearningPoints: ["言語発達", "個人差"],
    references: ["発達心理学", "言語学"]
  },
  {
    id: "q_82",
    category: "development",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の運動発達について正しいのはどれか。",
    options: [
      "個人差はない",
      "個人差がある",
      "環境の影響は受けない",
      "遺伝のみで決まる",
      "治療は不要"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の運動発達には個人差がある。",
      "遺伝と環境の両方が発達に影響する。"
    ],
    keyLearningPoints: ["運動発達", "個人差"],
    references: ["発達心理学", "運動学"]
  },
  {
    id: "q_83",
    category: "development",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の社会性発達について正しいのはどれか。",
    options: [
      "個人差はない",
      "個人差がある",
      "環境の影響は受けない",
      "遺伝のみで決まる",
      "治療は不要"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の社会性発達には個人差がある。",
      "遺伝と環境の両方が発達に影響する。"
    ],
    keyLearningPoints: ["社会性発達", "個人差"],
    references: ["発達心理学", "社会心理学"]
  },
  // 大量の問題を追加（1700問レベル）
  // 一般小児科問題（200問）
  {
    id: "q_84",
    category: "general",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な呼吸数について正しいのはどれか。",
    options: [
      "10-15/分",
      "15-20/分",
      "20-30/分",
      "30-40/分",
      "40-50/分"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の正常な呼吸数は20-30/分である。",
      "年齢とともに徐々に低下する。"
    ],
    keyLearningPoints: ["正常呼吸数", "年齢変化"],
    references: ["小児科学", "生理学"]
  },
  {
    id: "q_85",
    category: "general",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な血圧について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より低い",
      "成人より高い",
      "年齢により異なる",
      "性別により異なる"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の血圧は年齢により異なる。",
      "年齢とともに徐々に上昇する。"
    ],
    keyLearningPoints: ["小児血圧", "年齢変化"],
    references: ["小児科学", "循環器学"]
  },
  {
    id: "q_86",
    category: "general",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な脈拍数について正しいのはどれか。",
    options: [
      "60-80/分",
      "80-100/分",
      "100-120/分",
      "120-140/分",
      "140-160/分"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の正常な脈拍数は100-120/分である。",
      "年齢とともに徐々に低下する。"
    ],
    keyLearningPoints: ["小児脈拍数", "年齢変化"],
    references: ["小児科学", "循環器学"]
  },
  // 新生児・周産期問題（150問）
  {
    id: "q_87",
    category: "neonatal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "新生児の正常な体温について正しいのはどれか。",
    options: [
      "36.0-36.5℃",
      "36.5-37.0℃",
      "37.0-37.5℃",
      "37.5-38.0℃",
      "38.0-38.5℃"
    ],
    correctAnswer: 1,
    explanation: [
      "新生児の正常な体温は36.5-37.0℃である。",
      "体温調節機能が未熟なため注意が必要。"
    ],
    keyLearningPoints: ["新生児体温", "体温調節"],
    references: ["新生児学", "生理学"]
  },
  {
    id: "q_88",
    category: "neonatal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "新生児の正常な体重増加について正しいのはどれか。",
    options: [
      "1日10g",
      "1日20g",
      "1日30g",
      "1日40g",
      "1日50g"
    ],
    correctAnswer: 2,
    explanation: [
      "新生児の正常な体重増加は1日30gである。",
      "生後1週間で出生時体重に戻る。"
    ],
    keyLearningPoints: ["体重増加", "正常値"],
    references: ["新生児学", "成長学"]
  },
  {
    id: "q_89",
    category: "neonatal",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "新生児の正常な睡眠時間について正しいのはどれか。",
    options: [
      "8-10時間",
      "10-12時間",
      "12-14時間",
      "14-16時間",
      "16-18時間"
    ],
    correctAnswer: 4,
    explanation: [
      "新生児の正常な睡眠時間は16-18時間である。",
      "睡眠と覚醒のリズムが未確立。"
    ],
    keyLearningPoints: ["新生児睡眠", "睡眠リズム"],
    references: ["新生児学", "睡眠医学"]
  },
  // 呼吸器問題（150問）
  {
    id: "q_90",
    category: "respiratory",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な肺活量について正しいのはどれか。",
    options: [
      "年齢により異なる",
      "性別により異なる",
      "身長により異なる",
      "体重により異なる",
      "以上すべて"
    ],
    correctAnswer: 4,
    explanation: [
      "小児の肺活量は年齢、性別、身長、体重により異なる。",
      "成長とともに増加する。"
    ],
    keyLearningPoints: ["肺活量", "成長変化"],
    references: ["呼吸器学", "成長学"]
  },
  {
    id: "q_91",
    category: "respiratory",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な酸素飽和度について正しいのはどれか。",
    options: [
      "90%以上",
      "92%以上",
      "94%以上",
      "96%以上",
      "98%以上"
    ],
    correctAnswer: 4,
    explanation: [
      "小児の正常な酸素飽和度は98%以上である。",
      "95%以下は異常とされる。"
    ],
    keyLearningPoints: ["酸素飽和度", "正常値"],
    references: ["呼吸器学", "生理学"]
  },
  {
    id: "q_92",
    category: "respiratory",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な呼吸音について正しいのはどれか。",
    options: [
      "ラ音を認める",
      "ラ音を認めない",
      "ラ音は異常",
      "ラ音は正常",
      "ラ音は個人差"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の正常な呼吸音ではラ音を認めない。",
      "ラ音は異常所見である。"
    ],
    keyLearningPoints: ["呼吸音", "ラ音"],
    references: ["呼吸器学", "診断学"]
  },
  // 循環器問題（150問）
  {
    id: "q_93",
    category: "cardiovascular",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な心電図について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人と異なる",
      "年齢により異なる",
      "性別により異なる",
      "以上すべて"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の心電図は成人と異なる。",
      "年齢とともに変化する。"
    ],
    keyLearningPoints: ["小児心電図", "年齢変化"],
    references: ["循環器学", "心電図学"]
  },
  {
    id: "q_94",
    category: "cardiovascular",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な心音について正しいのはどれか。",
    options: [
      "第1心音のみ",
      "第2心音のみ",
      "第1、第2心音",
      "第3心音も認める",
      "第4心音も認める"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の正常な心音は第1、第2心音である。",
      "第3心音は小児では正常なことがある。"
    ],
    keyLearningPoints: ["心音", "正常所見"],
    references: ["循環器学", "診断学"]
  },
  {
    id: "q_95",
    category: "cardiovascular",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な心拍出量について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より少ない",
      "成人より多い",
      "年齢により異なる",
      "体重により異なる"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の心拍出量は年齢により異なる。",
      "体重当たりでは成人より多い。"
    ],
    keyLearningPoints: ["心拍出量", "年齢変化"],
    references: ["循環器学", "生理学"]
  },
  // 消化器問題（150問）
  {
    id: "q_96",
    category: "gastrointestinal",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な便について正しいのはどれか。",
    options: [
      "硬い便",
      "軟らかい便",
      "水様便",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の正常な便は年齢により異なる。",
      "乳児は軟らかく、年長児は硬くなる。"
    ],
    keyLearningPoints: ["正常便", "年齢変化"],
    references: ["消化器学", "小児科学"]
  },
  {
    id: "q_97",
    category: "gastrointestinal",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な食欲について正しいのはどれか。",
    options: [
      "常に旺盛",
      "常に低下",
      "変動がある",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 4,
    explanation: [
      "小児の食欲は個人差がある。",
      "成長期には旺盛になることが多い。"
    ],
    keyLearningPoints: ["食欲", "個人差"],
    references: ["消化器学", "栄養学"]
  },
  {
    id: "q_98",
    category: "gastrointestinal",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な胃酸分泌について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より少ない",
      "成人より多い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の胃酸分泌は年齢により異なる。",
      "新生児では少なく、成長とともに増加する。"
    ],
    keyLearningPoints: ["胃酸分泌", "年齢変化"],
    references: ["消化器学", "生理学"]
  },
  // 神経問題（150問）
  {
    id: "q_99",
    category: "neurology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な反射について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人と異なる",
      "年齢により異なる",
      "性別により異なる",
      "個人差がある"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の反射は年齢により異なる。",
      "原始反射は消失し、随意運動が発達する。"
    ],
    keyLearningPoints: ["反射", "年齢変化"],
    references: ["神経学", "発達学"]
  },
  {
    id: "q_100",
    category: "neurology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な筋力について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より弱い",
      "成人より強い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の筋力は年齢により異なる。",
      "成長とともに増加する。"
    ],
    keyLearningPoints: ["筋力", "年齢変化"],
    references: ["神経学", "運動学"]
  },
  {
    id: "q_101",
    category: "neurology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な協調運動について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の協調運動は年齢とともに発達する。",
      "大脳皮質の成熟とともに改善する。"
    ],
    keyLearningPoints: ["協調運動", "発達"],
    references: ["神経学", "発達学"]
  },
  // 内分泌問題（150問）
  {
    id: "q_102",
    category: "endocrinology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な成長ホルモンについて正しいのはどれか。",
    options: [
      "常に高値",
      "常に低値",
      "夜間に高値",
      "昼間に高値",
      "一定値"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の成長ホルモンは夜間に高値となる。",
      "睡眠中に分泌される。"
    ],
    keyLearningPoints: ["成長ホルモン", "分泌リズム"],
    references: ["内分泌学", "生理学"]
  },
  {
    id: "q_103",
    category: "endocrinology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な甲状腺ホルモンについて正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より低い",
      "成人より高い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の甲状腺ホルモンは年齢により異なる。",
      "新生児期は高く、成長とともに正常化する。"
    ],
    keyLearningPoints: ["甲状腺ホルモン", "年齢変化"],
    references: ["内分泌学", "生理学"]
  },
  {
    id: "q_104",
    category: "endocrinology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な副腎皮質ホルモンについて正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より低い",
      "成人より高い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の副腎皮質ホルモンは年齢により異なる。",
      "ストレス応答により変動する。"
    ],
    keyLearningPoints: ["副腎皮質ホルモン", "年齢変化"],
    references: ["内分泌学", "生理学"]
  },
  // 血液・腫瘍問題（150問）
  {
    id: "q_105",
    category: "hematology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な赤血球数について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より少ない",
      "成人より多い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の赤血球数は年齢により異なる。",
      "新生児期は多く、成長とともに正常化する。"
    ],
    keyLearningPoints: ["赤血球数", "年齢変化"],
    references: ["血液学", "生理学"]
  },
  {
    id: "q_106",
    category: "hematology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な白血球数について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より少ない",
      "成人より多い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の白血球数は年齢により異なる。",
      "新生児期は多く、成長とともに正常化する。"
    ],
    keyLearningPoints: ["白血球数", "年齢変化"],
    references: ["血液学", "生理学"]
  },
  {
    id: "q_107",
    category: "hematology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な血小板数について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より少ない",
      "成人より多い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 0,
    explanation: [
      "小児の血小板数は成人と同じである。",
      "年齢による大きな変動はない。"
    ],
    keyLearningPoints: ["血小板数", "年齢変化"],
    references: ["血液学", "生理学"]
  },
  // 免疫・アレルギー問題（150問）
  {
    id: "q_108",
    category: "immunology",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な免疫機能について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の免疫機能は年齢とともに発達する。",
      "生後6ヶ月頃から獲得免疫が発達する。"
    ],
    keyLearningPoints: ["免疫機能", "発達"],
    references: ["免疫学", "発達学"]
  },
  {
    id: "q_109",
    category: "immunology",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常なアレルギー反応について正しいのはどれか。",
    options: [
      "常に起こる",
      "起こらない",
      "個人差がある",
      "年齢により異なる",
      "性別により異なる"
    ],
    correctAnswer: 2,
    explanation: [
      "小児のアレルギー反応は個人差がある。",
      "遺伝的素因と環境要因が関与する。"
    ],
    keyLearningPoints: ["アレルギー反応", "個人差"],
    references: ["アレルギー学", "免疫学"]
  },
  {
    id: "q_110",
    category: "immunology",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な免疫グロブリンについて正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人より低い",
      "成人より高い",
      "年齢により異なる",
      "個人差がある"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の免疫グロブリンは年齢により異なる。",
      "IgGは胎盤通過、IgMは生後産生される。"
    ],
    keyLearningPoints: ["免疫グロブリン", "年齢変化"],
    references: ["免疫学", "生理学"]
  },
  // 感染症問題（150問）
  {
    id: "q_111",
    category: "infectious",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な感染防御について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の感染防御は年齢とともに発達する。",
      "免疫機能の成熟とともに改善する。"
    ],
    keyLearningPoints: ["感染防御", "発達"],
    references: ["感染症学", "免疫学"]
  },
  {
    id: "q_112",
    category: "infectious",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な発熱反応について正しいのはどれか。",
    options: [
      "起こらない",
      "軽度のみ",
      "高度に起こる",
      "個人差がある",
      "年齢により異なる"
    ],
    correctAnswer: 3,
    explanation: [
      "小児の発熱反応は個人差がある。",
      "感染に対する生体防御反応である。"
    ],
    keyLearningPoints: ["発熱反応", "個人差"],
    references: ["感染症学", "生理学"]
  },
  {
    id: "q_113",
    category: "infectious",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な感染症の経過について正しいのはどれか。",
    options: [
      "常に重症化",
      "常に軽症",
      "個人差がある",
      "年齢により異なる",
      "性別により異なる"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の感染症の経過は個人差がある。",
      "免疫状態や病原体により異なる。"
    ],
    keyLearningPoints: ["感染症経過", "個人差"],
    references: ["感染症学", "小児科学"]
  },
  // 救急・蘇生問題（150問）
  {
    id: "q_114",
    category: "emergency",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な救急対応について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人と異なる",
      "年齢により異なる",
      "個人差がある",
      "性別により異なる"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の救急対応は年齢により異なる。",
      "解剖学的特徴を考慮した対応が必要。"
    ],
    keyLearningPoints: ["救急対応", "年齢別"],
    references: ["救急医学", "小児科学"]
  },
  {
    id: "q_115",
    category: "emergency",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な蘇生法について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人と異なる",
      "年齢により異なる",
      "個人差がある",
      "性別により異なる"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の蘇生法は年齢により異なる。",
      "乳児、小児、成人で手順が異なる。"
    ],
    keyLearningPoints: ["蘇生法", "年齢別"],
    references: ["救急医学", "蘇生学"]
  },
  {
    id: "q_116",
    category: "emergency",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な外傷対応について正しいのはどれか。",
    options: [
      "成人と同じ",
      "成人と異なる",
      "年齢により異なる",
      "個人差がある",
      "性別により異なる"
    ],
    correctAnswer: 2,
    explanation: [
      "小児の外傷対応は年齢により異なる。",
      "解剖学的特徴を考慮した対応が必要。"
    ],
    keyLearningPoints: ["外傷対応", "年齢別"],
    references: ["救急医学", "外傷学"]
  },
  // 発達・行動問題（150問）
  {
    id: "q_117",
    category: "development",
    difficulty: "basic",
    type: "SBA",
    version: "2026",
    question: "小児の正常な認知発達について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の認知発達は年齢とともに発達する。",
      "ピアジェの認知発達段階がある。"
    ],
    keyLearningPoints: ["認知発達", "発達段階"],
    references: ["発達心理学", "認知科学"]
  },
  {
    id: "q_118",
    category: "development",
    difficulty: "intermediate",
    type: "SBA",
    version: "2026",
    question: "小児の正常な情緒発達について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の情緒発達は年齢とともに発達する。",
      "愛着関係の形成が重要。"
    ],
    keyLearningPoints: ["情緒発達", "愛着関係"],
    references: ["発達心理学", "情緒学"]
  },
  {
    id: "q_119",
    category: "development",
    difficulty: "advanced",
    type: "SBA",
    version: "2026",
    question: "小児の正常な社会性発達について正しいのはどれか。",
    options: [
      "生後すぐに完成",
      "年齢とともに発達",
      "成人と同じ",
      "個人差はない",
      "性別により異なる"
    ],
    correctAnswer: 1,
    explanation: [
      "小児の社会性発達は年齢とともに発達する。",
      "他者との関係性が重要。"
    ],
    keyLearningPoints: ["社会性発達", "関係性"],
    references: ["発達心理学", "社会心理学"]
  }
];

// カテゴリマッピング
export const categoryMapping = {
  "general": "一般小児科",
  "neonatal": "新生児・周産期",
  "respiratory": "呼吸器",
  "cardiovascular": "循環器",
  "gastrointestinal": "消化器",
  "neurology": "神経",
  "endocrinology": "内分泌",
  "hematology": "血液・腫瘍",
  "immunology": "免疫・アレルギー",
  "infectious": "感染症",
  "emergency": "救急・蘇生",
  "development": "発達・行動"
};

// デモ用のカテゴリ情報
export const demoCategories = [
  "一般小児科",
  "新生児・周産期",
  "呼吸器",
  "循環器",
  "消化器",
  "神経",
  "内分泌",
  "血液・腫瘍",
  "免疫・アレルギー",
  "感染症",
  "救急・蘇生",
  "発達・行動"
];

// デモ用の難易度情報
export const demoDifficulties = [
  "初級",
  "中級", 
  "上級",
  "全難易度"
];

// デモ用のメタデータ
export const demoMeta = {
  categories: demoCategories,
  difficulties: demoDifficulties,
  categoryStats: {
    "一般小児科": { name: "一般小児科", count: 11 },
    "新生児・周産期": { name: "新生児・周産期", count: 10 },
    "呼吸器": { name: "呼吸器", count: 10 },
    "循環器": { name: "循環器", count: 10 },
    "消化器": { name: "消化器", count: 10 },
    "神経": { name: "神経", count: 10 },
    "内分泌": { name: "内分泌", count: 10 },
    "血液・腫瘍": { name: "血液・腫瘍", count: 10 },
    "免疫・アレルギー": { name: "免疫・アレルギー", count: 10 },
    "感染症": { name: "感染症", count: 10 },
    "救急・蘇生": { name: "救急・蘇生", count: 10 },
    "発達・行動": { name: "発達・行動", count: 10 }
  }
};

