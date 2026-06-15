export interface SensorReflectorProduct {
  id: string;
  manufacturer: string;
  modelNumber: string;
  size: string;
  prismSize: string;
  features: string[];
  description: string;
}

export const sensorReflectorData: SensorReflectorProduct[] = [
  {
    id: "omron_r1",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R1",
    size: "59.9 × 40.3 mm (厚み: 7.5 mm)",
    prismSize: "標準コーナーキューブ (ピッチ約 1.5mm - 2.0mm)",
    features: [
      "光電センサー用リフレクタの世界標準型番",
      "取付穴が2箇所あり、様々なブラケットに適合",
      "アクリル(反射面)とABS(背面)の強固な融着構造による高い耐衝撃性"
    ],
    description: "最も広く産業用で使用されている光電センサー用反射板です。赤色光や赤外光の回帰反射形センサーと組み合わせて使用され、長距離検出において最も安定した反射効率を発揮します。"
  },
  {
    id: "omron_r1s",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R1S",
    size: "59.9 × 40.3 mm (厚み: 7.5 mm / 薄型・シール付き)",
    prismSize: "標準コーナーキューブ",
    features: [
      "E39-R1の薄型・背面に両面テープを貼付した仕様",
      "ビス留めが困難な狭いスペースや平面へのスピード施工が可能",
      "アクリル成形面の高い平面度によるシャープな戻り光"
    ],
    description: "E39-R1の優れた反射性能をそのままに、両面テープで直接装置壁面に貼付できるようにした製品です。フラットな外観が必要な場合に選ばれます。"
  },
  {
    id: "omron_r3",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R3",
    size: "27 × 27 mm (小型正方形)",
    prismSize: "微小コーナーキューブ (ピッチ約 0.5mm)",
    features: [
      "小型・省スペース設計の装置内組み込み用リフレクタ",
      "微小プリズム素子により、小型でも高輝度を維持",
      "短〜中距離の回帰反射形センサーに対応"
    ],
    description: "半導体製造装置や小型包装機械などの内部スペースが限られた場所に設置するための正方形リフレクタです。プリズム素子が細かく設計されているため、近距離での検出ムラを抑えます。"
  },
  {
    id: "omron_r4",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-RS1 / RS2 / RS3",
    size: "シート形状 (幅 10mm〜 / 長さ自由カット)",
    prismSize: "マイクロプリズムテープ型 (オラフォル製シートを採用)",
    features: [
      "テープのように貼るだけのロール・シート状反射材",
      "ハサミやカッターで自由なサイズにカットして貼り付け可能",
      "非常に薄いため、円柱などの曲面へ巻き付け可能"
    ],
    description: "テープ状で供給されるため、搬送ラインのガイドレールやパレットの側面など、長さが必要な個所に連続して貼るのに最適です。Orafol（旧Reflexite）のマイクロプリズムフィルム技術が基盤となっています。"
  },
  {
    id: "keyence_r1",
    manufacturer: "キーエンス (KEYENCE)",
    modelNumber: "OP-42171",
    size: "60 × 40.5 mm",
    prismSize: "高精度直交三面体コーナーキューブ",
    features: [
      "キーエンス製回帰反射形光電センサーの標準アクセサリ",
      "レーザー光電センサーでの偏光検出において、高い偏光保存率を維持",
      "外周リブ構造により機械的変形や曲がりに強い"
    ],
    description: "超高速・高感度を特徴とするキーエンス製センサーの光線を、偏光を崩さずに光源へ戻すための高精度リフレクタです。レーザーセンサーの微小スポット光を的確に受光・反射させます。"
  },
  {
    id: "keyence_r2",
    manufacturer: "キーエンス (KEYENCE)",
    modelNumber: "OP-84327 (小型ピンポイント型)",
    size: "20.2 × 13 mm",
    prismSize: "超微細マイクロプリズム (ピッチ 0.2mm以下)",
    features: [
      "超小型電子部品などのピンポイント検出用リフレクタ",
      "極微細プリズムアレイにより、レーザービームの極小スポットでも確実な検出が可能",
      "近接設置時の不要反射（迷光）を抑制する独自設計"
    ],
    description: "微小な電子部品や薄型パレットの通過検知など、ミリ単位の検出領域で使用される超小型・高精度リフレクタです。素子が極めて細かいため、スポット光があたる箇所による感度ばらつきがありません。"
  },
  {
    id: "orafol_pl80",
    manufacturer: "オラフォル (ORAFOL / 旧リフレクサイト)",
    modelNumber: "ORALITE® PL80A / PL50A",
    size: "82 × 82 mm (PL80A) / 52 × 52 mm (PL50A)",
    prismSize: "高精度ヘキサゴナル・マイクロプリズム",
    features: [
      "Orafol（旧リフレクサイト）が誇る世界最高レベルの金型製造技術による超高精度反射",
      "ヘキサゴナル（六角形）配列プリズムによる全方位反射均一性",
      "アクリルPMMA樹脂による極めて高い透明度と耐候性"
    ],
    description: "光学フィルムのパイオニアが開発した、センサー用リフレクタの最高峰です。オムロンやキーエンス等のセンサーメーカー各社に対しても、この高精度プリズムシートや金型技術がOEM/供給されています。長距離での光量減衰を最小限に抑えます。"
  }
];
