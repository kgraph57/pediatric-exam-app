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
    "一般小児科": { name: "一般小児科", count: 3 },
    "新生児・周産期": { name: "新生児・周産期", count: 4 },
    "呼吸器": { name: "呼吸器", count: 4 },
    "循環器": { name: "循環器", count: 4 },
    "消化器": { name: "消化器", count: 4 },
    "神経": { name: "神経", count: 4 },
    "内分泌": { name: "内分泌", count: 4 },
    "血液・腫瘍": { name: "血液・腫瘍", count: 4 },
    "免疫・アレルギー": { name: "免疫・アレルギー", count: 4 },
    "感染症": { name: "感染症", count: 4 },
    "救急・蘇生": { name: "救急・蘇生", count: 4 },
    "発達・行動": { name: "発達・行動", count: 4 }
  }
};

