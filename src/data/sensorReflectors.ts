export interface SensorReflectorProduct {
  id: string;
  manufacturer: string;
  modelNumber: string;
  size: string;
  prismSize: string;
  features: string[];
  description: string;
  officialUrl: string; // 公式Webサイトまたは製品情報URL
}

export const sensorReflectorData: SensorReflectorProduct[] = [
  {
    id: "omron_r1",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R1",
    size: "59.9 × 40.3 mm (厚み: 7.5 mm)",
    prismSize: "標準コーナーキューブ (ピッチ約 1.5mm - 2.0mm)",
    officialUrl: "https://www.fa.omron.co.jp/products/family/3181/lineup.html",
    features: [
      "光電センサー用リフレクタにおける世界的なデファクトスタンダード",
      "取付ビス穴が2箇所あり、多くの標準取付金具（E39-L44等）に対応",
      "PMMA（アクリル反射面）とABS（背面カバー）の超音波融着による高密閉・耐衝撃構造"
    ],
    description: "FAラインやコンベア搬送システムで最も普及している、回帰反射形光電センサー用の標準反射板です。赤色LED光および赤外LED光の受光閾値に対して、最も安定した回帰反射立体角を提供し、アライメント（光軸調整）の許容度も広いのが特徴です。"
  },
  {
    id: "omron_r1s",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R1S",
    size: "59.9 × 40.3 mm (厚み: 7.5 mm / 両面テープ貼付型)",
    prismSize: "標準コーナーキューブ",
    officialUrl: "https://www.fa.omron.co.jp/products/family/3181/lineup.html",
    features: [
      "E39-R1の背面に強力な屋外用アクリル系両面テープがあらかじめ貼付された仕様",
      "ネジ穴加工ができない薄型フレームや、装置のアルマイトアルミ面への瞬時固定が可能",
      "成形金型の極めて高い平面精度により、長距離貼付時も戻り光の散乱が極小"
    ],
    description: "ネジ締めスペースがない自動化機械の内部や、クリーンルーム内の装置外面などに貼り付けて使用されるリフレクタです。施工の手間を削減し、突起物を減らしたいクリーンな設計に向いています。"
  },
  {
    id: "omron_r3",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-R3",
    size: "27 × 27 mm (小型正方形)",
    prismSize: "微小コーナーキューブ (ピッチ約 0.5mm)",
    officialUrl: "https://www.fa.omron.co.jp/products/family/3181/lineup.html",
    features: [
      "小型電子部品検査や基板搬送装置向けの超省スペース設計",
      "微小プリズムピッチにより、近距離設置でも検出ビームのデッドスポット（感度ムラ）が発生しない",
      "M3の1点ビス留め構造により、素早い角度調整が可能"
    ],
    description: "半導体ウエハ搬送装置やロボットアームのハンド部など、ミリ単位の省スペース性が要求される機構内部への設置に最適な小型反射板です。素子ピッチが細かいため、細いビームの光電センサーに適合します。"
  },
  {
    id: "omron_r4",
    manufacturer: "オムロン (OMRON)",
    modelNumber: "E39-RS1 / RS2 / RS3",
    size: "テープ・シート形状 (幅 10mm / 35mm / 80mm、長さ自由カット)",
    prismSize: "マイクロプリズムテープ型 (ORAFOL製高耐久シート採用)",
    officialUrl: "https://www.fa.omron.co.jp/products/family/95/lineup.html",
    features: [
      "ハサミやカッターで対象物のサイズに合わせて自由自在にカット可能",
      "厚みが約0.4mmと極めて薄く、シリンダーやガイド丸パイプなどの曲面へ巻き付け貼り付けが可能",
      "高密度マイクロプリズムアレイにより、テープ状でありながらプラスチック成形リフレクタに迫る反射効率"
    ],
    description: "搬送ラインの長い側壁やパレットの側面、円形の回転テーブルの外周などに貼り付けるためのテープ状の再帰反射材です。Orafol社の特許である単層ソリッドマイクロプリズム技術が活用されており、水分の侵入による劣化がありません。"
  },
  {
    id: "keyence_r1",
    manufacturer: "キーエンス (KEYENCE)",
    modelNumber: "OP-42171 (標準リフレクタ)",
    size: "60 × 40.5 mm (取付ピッチ: 52 mm)",
    prismSize: "高精度直交三面体コーナーキューブ",
    officialUrl: "https://www.keyence.co.jp/products/sensor/photoelectric/pz-v/",
    features: [
      "キーエンスの代表的アンプ内蔵光電センサー（PZ-V/PZ-Mシリーズ等）に完全適合",
      "偏光保持能力が非常に高く、センサーに内蔵されたM.S.R.（偏光選択）機能を100%引き出す設計",
      "振動による変形や光学歪みを防ぐ、強化リブ付きポリカーボネート樹脂成形"
    ],
    description: "キーエンス製の高速・長距離光電センサーと組み合わせて使用される、超高精度な反射板です。偏光フィルタを通過した赤色レーザーやLED光の偏光方向を、極めて高い保持率で90度回転させて返すことができるため、鏡面ワークの誤検出を完全にシャットアウトします。"
  },
  {
    id: "keyence_r2",
    manufacturer: "キーエンス (KEYENCE)",
    modelNumber: "OP-84327 (極小ピンポイント型)",
    size: "20.2 × 13 mm (超小型)",
    prismSize: "超微細マイクロプリズム (ピッチ 0.2mm以下)",
    officialUrl: "https://www.keyence.co.jp/products/sensor/photoelectric/pr-m/",
    features: [
      "電子部品、コネクタピンの有無検出や、超薄型搬送パレットの通過検知に最適",
      "極微細プリズムアレイにより、レーザーセンサーの超微小スポット光（Φ0.5mm程度）の全受光を安定化",
      "センサーヘッドの超至近距離に配置しても、不要反射（迷光）による誤動作を起こさない光学カット設計"
    ],
    description: "超小型光電センサー（PR-Mシリーズ等）のレーザー光束を正確に受光・回帰させるために開発された、業界最小クラスの高精度マイクロリフレクタです。ピッチが極めて微細なため、ビームが当たる位置による受光強度のばらつきが皆無です。"
  },
  {
    id: "orafol_pl80",
    manufacturer: "ORAFOL (オラフォル / 旧リフレクサイト)",
    modelNumber: "ORALITE® PL80A / PL50A",
    size: "82 × 82 mm (PL80A) / 52 × 52 mm (PL50A)",
    prismSize: "高精度ヘキサゴナル・マイクロプリズム",
    officialUrl: "https://www.orafol.com/ja/japan/products/oralite-pl-80-a",
    features: [
      "旧Reflexiteのコア金型技術による、アクリル樹脂の一体成形マイクロプリズム",
      "ヘキサゴナル（六角形）アレイ配列により、標識の回転角度（アライメント）に依存しない全方位の完全対称反射",
      "アクリル最高峰グレードの透明度により、超長距離検出（最大10m以上）における圧倒的な光量を確保"
    ],
    description: "センサーメーカー各社へ金型およびOEM供給を行っている、世界最高峰の光学性能を持つインダストリアルリフレクタです。六角形に配列された精密プリズムが光を極めて鋭く、かつ対称に戻すため、長距離センシングや高精度レーザーセンサーの反射体として最高の信頼性を持ちます。"
  }
];
