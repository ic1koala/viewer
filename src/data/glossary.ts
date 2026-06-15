export interface Term {
  id: string;
  name: string;
  english: string;
  reading: string;
  symbol?: string;
  category: 'physics' | 'measurement' | 'structure' | 'security' | 'standards' | 'env';
  definition: string;
  details: string;
}

export const glossaryData: Term[] = [
  {
    id: "term_retroreflection",
    name: "再帰反射",
    english: "Retroreflection",
    reading: "さいきはんしゃ",
    category: "physics",
    definition: "入射した光が反射体の表面で屈折・反射を繰り返し、光がやってきた光源の方向へと正確に戻る光学現象。",
    details: "道路標識、安全ベスト、自転車の反射板などに使用されています。鏡のような「正反射（鏡面反射）」や、壁のような「乱反射（拡散反射）」とは異なり、どの角度から光が当たっても光源に向かってダイレクトに光を返すため、夜間の視認性を飛躍的に高めることができます。"
  },
  {
    id: "term_entrance_angle",
    name: "入射角",
    english: "Entrance Angle",
    reading: "にゅうしゃかく",
    symbol: "β",
    category: "measurement",
    definition: "反射シートに当たる光の照射軸と、シート面に対して垂直な基準軸（法線）とがなす角度。",
    details: "自動車のヘッドライト光が、標識に対してどれだけ斜めから入るかを表します。カーブの入り口にある標識や、道路脇のポールなどは入射角が大きくなります。入射角が大きくなっても良好な輝度を保てる特性を「広角性」と呼びます。"
  },
  {
    id: "term_observation_angle",
    name: "観測角",
    english: "Observation Angle",
    reading: "かんそくかく",
    symbol: "α",
    category: "measurement",
    definition: "光源から反射シートに届く「照射軸」と、シートから観測者の目に届く「観測軸」とがなす角度。",
    details: "夜間の自動車運転において、ヘッドライトの光源とドライバーの目の高さ・位置の差に相当します。距離が離れるほど観測角は小さくなり、標識に近づくにつれて観測角は大きくなります。一般的に観測角が小さい（遠方にいる）ほど反射光は明るく見えますが、大型トラックなどではアイポイントが高いため観測角が大きくなりやすく、大観測角でも視認できる性能が重要になります。"
  },
  {
    id: "term_coefficient_retroreflection",
    name: "比反射輝度係数",
    english: "Coefficient of Retroreflection",
    reading: "ひはんしゃきどけいすう",
    symbol: "RA",
    category: "measurement",
    definition: "反射シートの再帰反射性能を表す標準的な物理量。単位は cd・lx⁻¹・m⁻²。",
    details: "JIS Z 8714 や CIE 規格で定義されており、反射面に対する照度と面積当たりの反射光度（カンデラ）の比率で表されます。この数値が大きいほど、少ない光で明るく視認できる反射シートであることを意味します。一般的にプリズム型はビーズ型に比べてこの数値が非常に高くなります。"
  },
  {
    id: "term_glass_bead",
    name: "ガラスビーズ型",
    english: "Glass Bead Type",
    reading: "がらすびーずがた",
    category: "structure",
    definition: "微小な球状のガラス粒子をレンズとして利用し、背面の反射層と組み合わせて再帰反射を実現する方式。",
    details: "比較的安価で柔軟性が高く、製造が容易です。入射光はビーズ内部で屈折して集光され、底面の反射層で跳ね返って元に戻ります。広角性に優れますが、反射効率（輝度）はプリズム型に劣ります。封入レンズ型やカプセルレンズ型などのバリエーションがあります。"
  },
  {
    id: "term_corner_cube",
    name: "コーナーキューブ型 (プリズム型)",
    english: "Corner Cube Type (Prism Type)",
    reading: "こーなーきゅーぶがた",
    category: "structure",
    definition: "立方体の角を切り取った三面直交の錐体構造（プリズム）を微細に並べた反射構造。",
    details: "入射した光が3つの直交する平面で次々と全反射（Total Internal Reflection）を繰り返すことにより、入射角に依存せず元の方向へ光を戻します。ガラスビーズ方式のように反射金属膜を必要とせず、樹脂と空気の界面での全反射を利用するため反射効率が極めて高く、遠距離からの高い視認性を誇ります。"
  },
  {
    id: "term_full_cube",
    name: "フルキューブプリズム",
    english: "Full Cube Prism",
    reading: "ふるきゅーぶぷりずむ",
    category: "structure",
    definition: "三面体プリズムのうち、光学的に反射に寄与しないデッドスペースを金型設計によって極限まで排除し、有効反射面積をほぼ100%にした構造。",
    details: "3Mの「ダイヤモンドグレード DG³」に採用されている独自技術です。従来のプリズムではカットラインの幾何学的制約上、一部に光を通してしまうデッドスペース（非アクティブ領域）が生じ、反射効率は約60%に制限されていましたが、フルキューブではほぼ100%のアクティブ反射領域を実現し、圧倒的な輝度を達成しています。"
  },
  {
    id: "term_solid_structure",
    name: "単層構造 (ソリッド構造)",
    english: "Solid Structure",
    reading: "たんそうこうぞう",
    category: "structure",
    definition: "プリズムの裏面を直接アクリルなどの保護用樹脂層や接着剤で充填し、内部に空気層を持たない構造。",
    details: "オラフォル（ORAFOL）社の反射シートに多く見られる特徴です。3MやNCIの多くの製品で採用されている「カプセル構造（空気層を持つ）」とは異なり、カットした断面から雨水や泥が空気層へ侵入する心配がありません。そのため、施工時に必要な端面シール処理（目封じ）が不要となり、作業の効率化と薄型軽量化に寄与します。"
  },
  {
    id: "term_destructible_sheet",
    name: "破壊性反射シート",
    english: "Destructible Reflective Sheet",
    reading: "はかいせいはんしゃしーと",
    category: "security",
    definition: "貼り付けた対象から無理に剥がそうとすると、基材層が自己破壊してバラバラになる特殊な構造を持つシート。",
    details: "日本カーバイド工業（NCI）が特許を持つセキュリティ反射技術です。支持体と接着層の間に極めて脆い破壊層を介在させることで、ナンバープレートや車両の登録標章ステッカーの不正な剥ぎ取り・二次利用（偽造）を防ぐことができます。"
  },
  {
    id: "term_snells_law",
    name: "スネルの法則",
    english: "Snell's Law",
    reading: "すねるのほうそく",
    category: "physics",
    definition: "光が異なる屈折率の媒質境界を通過する際、入射角と屈折角の間に成り立つ光学の基本法則。",
    details: "式は n₁ sin θ₁ = n₂ sin θ₂ で表されます。ガラスビーズ内に入射した光がどこで焦点を結ぶかを計算する幾何光学設計の基礎であり、再帰反射シートのビーズ屈折率設計（空気中露出型では 2.0、樹脂封入型では 1.9）に直接応用されています。"
  },
  {
    id: "term_total_internal_reflection",
    name: "全反射",
    english: "Total Internal Reflection",
    reading: "ぜんはんしゃ",
    category: "physics",
    definition: "光が屈折率の大きい媒質から小さい媒質へと進む際、入射角が一定の限界（臨界角）を超えると、光が透過せずにすべて反射される現象。",
    details: "プリズム型再帰反射シートはこの現象を利用しています。アクリルやポリカーボネート（屈折率約1.5）で形成されたコーナーキューブの外側（空気層、屈折率1.0）との境界で全反射が起こることで、鏡（金属膜）を使わずに100%近い効率で光を反射させることができます。空気層が塞がれる（水や接着剤が直接浸入する）と全反射条件が崩れて光が透過してしまうため、カプセル構造で空気層を保護するか、オラフォルのように特殊な単層構造を採用する必要があります。"
  },
  {
    id: "term_specular",
    name: "鏡面反射 / 正反射",
    english: "Specular Reflection",
    reading: "きょうめんはんしゃ",
    category: "physics",
    definition: "入射角と反射角が等しくなる一方向への光の反射現象。",
    details: "鏡や滑らかな水面、平滑な金属板などで起こります。入射した光線は一方向にしか反射しないため、観察者がその反射方向（反射角）の直線上にいない限り、光って見えません。"
  },
  {
    id: "term_diffuse",
    name: "乱反射 / 拡散反射",
    english: "Diffuse Reflection",
    reading: "diffuse reflection",
    reading_ja: "らはんしゃ",
    category: "physics",
    definition: "入射した光が反射面で様々な方向へランダムに散乱する反射現象。",
    details: "紙や壁、道路のアスファルトなど、大半の不透明な物体で見られる反射です。光があらゆる方向に散らばるため、どの角度から見ても同じような明るさに見えますが、光源方向へ戻る光はごく僅かなため、夜間の視認性は低くなります。"
  },
  {
    id: "term_jis_z_8714",
    name: "JIS Z 8714",
    english: "JIS Z 8714",
    reading: "じすぜっとはちなないちよん",
    category: "standards",
    definition: "日本産業規格における「再帰反射安全表示板」の測定方法や性能基準を定めた規格。",
    details: "夜間の交通安全や作業者の視認性確保のために、再帰反射材（標識、安全ベスト用テープなど）の色度範囲、比反射輝度係数の最小基準値、耐候性試験の方法などが厳格に規定されています。"
  },
  {
    id: "term_ece_104",
    name: "ECE 104",
    english: "ECE 104",
    reading: "いーしーいーいちまるよん",
    category: "standards",
    definition: "ヨーロッパにおける大型商用車両（トラックやトレーラーなど）の側面・後部に貼り付ける、視認性向上のための反射マーキングテープの安全基準および技術規格。",
    details: "夜間に大型車両の存在や車体の全長・全幅を明確に示す「輪郭マーキング」を義務付けており、オラフォルの「ORALITE VC 104+」や3Mの「983シリーズ」などがこの規格に適合しています。日本でもこれに準拠した基準が導入されています。"
  },
  {
    id: "term_temporary_loss",
    name: "一時的反射輝度低下",
    english: "Temporary Loss of Retroreflectivity",
    reading: "いちじてきはんしゃきどていか",
    category: "env",
    definition: "反射シート表面に水滴や結露、または汚れが付着することで、一時的に反射性能が極端に低下する現象。",
    details: "露出レンズ（ガラスビーズ）型などでは、雨水などの水滴がビーズに付着すると、ビーズ界面の屈折状態が変化し、光線が反射層に焦点を結ばなくなります。これを防ぐために、ビーズを透明樹脂の内部に埋め込んだ「封入レンズ型」や「カプセルレンズ型」が開発されました。"
  },
  {
    id: "term_edge_sealing",
    name: "端面シール (目封じ)",
    english: "Edge Sealing",
    reading: "たんめんしーる",
    category: "structure",
    definition: "カプセル構造を持つ反射シートを切断した際、切断面の空気層をシールして水分や汚れの侵入を防ぐ加工処理。",
    details: "カプセル構造の空気層内に水分が入ると、樹脂と空気の界面での全反射（プリズムの場合）や、ガラスビーズ裏面の焦点構造が損なわれ、反射しなくなります。そのため、3MやNCIの多くの反射シートは、切断後にヒートシール等で端面を閉じる必要があります。オラフォルの単層構造シートはこの加工が不要です。"
  }
] as any;
