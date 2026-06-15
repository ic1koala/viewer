import React, { useState } from 'react';
import { manufacturersData, type Manufacturer } from '../data/manufacturers';

export const Manufacturers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('3m');
  const [academyMode, setAcademyMode] = useState<boolean>(false);

  const selectedMfr: Manufacturer = manufacturersData.find((m) => m.id === activeTab) || manufacturersData[0];

  // 評価項目のレーティング表示用ヘルパー
  const renderStars = (score: number) => {
    return (
      <div className="star-rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star ${i < score ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="manufacturers-container">
      <div className="manufacturers-header">
        <h2 className="section-title">主要メーカー分析 ＆ 技術アカデミー</h2>
        <p className="section-subtitle">
          再帰反射シート市場をリードする3大グローバルメーカーの製品ラインナップの網羅的解説と、幾何光学の数理を深く学習できます。
        </p>
      </div>

      {/* サブセクション切り替え */}
      <div className="sub-section-tabs">
        <button
          className={`sub-tab-btn ${!academyMode ? 'active' : ''}`}
          onClick={() => setAcademyMode(false)}
        >
          🔍 主要メーカー比較・製品全カタログ
        </button>
        <button
          className={`sub-tab-btn ${academyMode ? 'active' : ''}`}
          onClick={() => setAcademyMode(true)}
        >
          🎓 技術アカデミー (数理幾何光学)
        </button>
      </div>

      {!academyMode ? (
        <div className="mfr-layout">
          {/* メーカー選択サイドバー */}
          <div className="mfr-sidebar">
            {manufacturersData.map((m) => (
              <button
                key={m.id}
                className={`mfr-tab ${activeTab === m.id ? 'active' : ''}`}
                onClick={() => setActiveTab(m.id)}
              >
                <span className="mfr-name-main">{m.name}</span>
                <span className="mfr-name-sub">{m.country}</span>
              </button>
            ))}
          </div>

          {/* メーカー詳細表示 */}
          <div className="mfr-detail-content animated fadeIn">
            <div className="mfr-header-row">
              <h3 className="mfr-full-title">{selectedMfr.fullName}</h3>
              <div className="mfr-links">
                <a
                  href={selectedMfr.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mfr-link-btn primary-link"
                >
                  🔗 日本公式サイトへ
                </a>
                {selectedMfr.globalUrl && (
                  <a
                    href={selectedMfr.globalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mfr-link-btn secondary-link"
                  >
                    🌐 Global Site
                  </a>
                )}
              </div>
            </div>
            
            {/* 特徴タグ */}
            <div className="mfr-meta-grid">
              <div className="meta-item">
                <span className="meta-label">創業</span>
                <span className="meta-value">{selectedMfr.founded}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">代表技術</span>
                <span className="meta-value font-highlight">{selectedMfr.coreTech}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">発祥国</span>
                <span className="meta-value">{selectedMfr.country}</span>
              </div>
            </div>

            {/* スペックレーティング */}
            <div className="specs-ratings-box">
              <h4 className="box-title">性能レーティング (光学・物理特性の各社相対比較)</h4>
              <div className="ratings-grid">
                <div className="rating-row">
                  <span className="rating-label">反射輝度 (Peak Brightness)</span>
                  {renderStars(selectedMfr.scores.brightness)}
                </div>
                <div className="rating-row">
                  <span className="rating-label">柔軟性 (Flexibility)</span>
                  {renderStars(selectedMfr.scores.flexibility)}
                </div>
                <div className="rating-row">
                  <span className="rating-label">施工性・目封じ不要度 (Workability)</span>
                  {renderStars(selectedMfr.scores.workability)}
                </div>
                <div className="rating-row">
                  <span className="rating-label">屋外耐久性 (Durability)</span>
                  {renderStars(selectedMfr.scores.durability)}
                </div>
                <div className="rating-row">
                  <span className="rating-label">不正防止・セキュリティ性 (Security)</span>
                  {renderStars(selectedMfr.scores.security)}
                </div>
              </div>
            </div>

            {/* 保管・温度仕様 */}
            <div className="detail-section specs-environmental-box">
              <h4 className="section-heading-small">物理・環境適合仕様（保管条件・施工/使用温度）</h4>
              <div className="env-specs-grid">
                <div className="env-spec-card">
                  <div className="env-spec-icon">🌡️</div>
                  <div className="env-spec-details">
                    <h5>推奨保管環境</h5>
                    <p>{selectedMfr.id === '3m' 
                      ? '温度 18°C〜24°C / 相対湿度 30%〜50% (直射日光厳禁)' 
                      : selectedMfr.id === 'orafol' 
                      ? '温度 18°C〜24°C / 相対湿度 40%〜60% (直射日光厳禁)' 
                      : '温度 15°C〜27°C / 相対湿度 30%〜60% (直射日光避ける)'
                    }</p>
                  </div>
                </div>
                <div className="env-spec-card">
                  <div className="env-spec-icon">📦</div>
                  <div className="env-spec-details">
                    <h5>保管方法 ＆ 有効期限</h5>
                    <p>{selectedMfr.id === '3m'
                      ? '水平懸架または箱入り水平保管 / 製造後 2〜3年以内の施工推奨'
                      : selectedMfr.id === 'orafol'
                      ? '両端スペーサーを用いた水平懸架 / 製造後 2年以内の施工推奨'
                      : '専用保持具または宙吊り水平保管 / 購入後 1年以内の使用推奨(床への直置き・立てかけ厳禁)'
                    }</p>
                  </div>
                </div>
                <div className="env-spec-card">
                  <div className="env-spec-icon">🛠️</div>
                  <div className="env-spec-details">
                    <h5>推奨施工温度 (貼り付け/カット)</h5>
                    <p>{selectedMfr.id === '3m'
                      ? '貼り付け: 18°C以上推奨 (低温時は基材とシートのヒーター加温が必須)'
                      : selectedMfr.id === 'orafol'
                      ? '貼り付け: 15°C〜38°C推奨 (施工時の最低限界周囲温度: 7°C〜8°C以上)'
                      : '貼り付け: 20°C〜26°C推奨 (端面クラック防止のため18°C以下でのカット切断は厳禁)'
                    }</p>
                  </div>
                </div>
                <div className="env-spec-card">
                  <div className="env-spec-icon">❄️</div>
                  <div className="env-spec-details">
                    <h5>実用動作温度耐性 (施工後)</h5>
                    <p>{selectedMfr.id === '3m'
                      ? '-40°C 〜 +82°C (極寒の降雪地域からアスファルト反射の酷暑まで耐性を実証)'
                      : selectedMfr.id === 'orafol'
                      ? '-40°C 〜 +82°C (単層構造により海水浸漬や過酷な高湿度下の白濁化・腐食も防止)'
                      : '-40°C 〜 +82°C (アクリル樹脂の国内調合技術により寒暖差での破断・ひび割れを抑制)'
                    }</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 歴史・概要 */}
            <div className="detail-section">
              <h4 className="section-heading-small">沿革と開発の歴史</h4>
              <p className="section-body-text">{selectedMfr.history}</p>
            </div>

            {/* 技術詳細 */}
            <div className="detail-section">
              <h4 className="section-heading-small">核心となる特許光学技術: {selectedMfr.coreTech}</h4>
              <p className="section-body-text">{selectedMfr.coreTechDesc}</p>
            </div>

            {/* 主な強みリスト */}
            <div className="detail-section">
              <h4 className="section-heading-small">製品の主な強み・技術的メリット</h4>
              <ul className="bullet-list">
                {selectedMfr.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>

            {/* 網羅製品カタログ */}
            <div className="detail-section">
              <h4 className="section-heading-small">全製品ラインナップ・詳細カタログ</h4>
              <p className="section-intro-text">
                以下は、{selectedMfr.name}が提供する公式のほぼすべての主要反射材料製品ラインナップです。用途、耐候年数、JIS/JIS相当の適合規格などの詳細情報を網羅しています。
              </p>
              
              <div className="extended-products-list">
                {selectedMfr.products.map((p, i) => (
                  <div key={i} className="extended-product-card">
                    <div className="card-top-info">
                      <span className="prod-type-label">{p.type}</span>
                      <span className="prod-lifespan-label">⏳ 耐候年数: <strong>{p.lifespan}</strong></span>
                    </div>
                    <h5 className="prod-name-title">{p.name}</h5>
                    <div className="prod-model-num">型番・シリーズ: <code>{p.model}</code></div>
                    <p className="prod-description-text">{p.desc}</p>
                    
                    <div className="prod-specs-sub-grid">
                      <div className="spec-sub-item">
                        <strong>適合規格:</strong> <span>{p.standards}</span>
                      </div>
                      {p.colorVariations && (
                        <div className="spec-sub-item">
                          <strong>主なカラー:</strong> <span>{p.colorVariations}</span>
                        </div>
                      )}
                    </div>

                    <div className="prod-features-box">
                      <strong>製品の光学・物理的特徴:</strong>
                      <ul className="prod-features-bullet">
                        {p.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 特許情報 */}
            <div className="detail-section">
              <h4 className="section-heading-small">保有するコア特許技術</h4>
              <div className="patents-box">
                {selectedMfr.patents.map((pat, i) => (
                  <div key={i} className="patent-item">
                    <div className="patent-header">
                      <span className="patent-num">{pat.number}</span>
                      <strong className="patent-name">{pat.name}</strong>
                    </div>
                    <p className="patent-desc">{pat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 主な導入先 */}
            <div className="detail-section">
              <h4 className="section-heading-small">主な導入先・実用例</h4>
              <div className="apps-tag-wrapper">
                {selectedMfr.applications.map((app, i) => (
                  <span key={i} className="app-tag">
                    {app}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        // 技術アカデミー (数理光学) サブセクション
        <div className="academy-layout animated fadeIn">
          <div className="academy-intro">
            <h3>幾何光学と物理法則に基づく再帰反射の数理</h3>
            <p>
              再帰反射シートは、入射光を平行に近い状態で光源に戻すために、幾何学的な対称性と物質の屈折率を徹底的に計算して設計されています。以下に、主要2大方式の数理的アプローチを解説します。
            </p>
          </div>

          <div className="academy-grid">
            {/* ガラスビーズ型の数理 */}
            <div className="academy-card">
              <div className="academy-card-header">
                <span className="structure-label bead-label">ガラスビーズ方式</span>
                <h4>屈折と集光の幾何光学</h4>
              </div>
              <div className="academy-card-body">
                <p>
                  ガラスビーズ型では、ビーズそれ自身がレンズとして機能し、その裏面に光をピント合わせ（集光）することで光を平行に戻します。
                </p>
                
                <div className="formula-box">
                  <h5>スネルの法則 (Snell's Law)</h5>
                  <code>n₁ sin θ₁ = n₂ sin θ₂</code>
                  <p className="formula-desc">異なる屈折率の境界を光が通過する際の屈折角を記述する基本物理法則。</p>
                </div>

                <div className="formula-box">
                  <h5>球面屈折公式 (近軸屈折)</h5>
                  <code>n₁/s + n₂/s' = (n₂ - n₁)/R</code>
                  <p className="formula-desc">
                    曲率半径 <code>R</code> の球面境界における物点距離 <code>s</code> と像点距離 <code>s'</code> の関係式。
                    無限遠（平行光線）から入射（<code>s = ∞</code>）、外部媒質が空気（<code>n₁ = 1.0</code>）、ビーズ屈折率を <code>n₂ = n</code> とすると、
                    像がビーズの裏面（<code>s' = 2R</code>：直径の距離）にちょうどピントを結ぶ条件は、
                    <code>1/∞ + n/(2R) = (n - 1)/R  ⇒  n/2 = n - 1  ⇒  <strong>n = 2.0</strong></code> となり、屈折率がジャスト2.0のとき完全に裏面反射膜上で結像して再帰反射効率が最大化されます。
                  </p>
                </div>

                <div className="academy-comparison">
                  <h5>実製品の屈折率補正</h5>
                  <ul>
                    <li>
                      <strong>露出レンズ型:</strong> ビーズの上半分が空気に直接触れているため、最適屈折率は理論値に近い <strong>n ≈ 1.9 〜 2.2</strong> に設計されます。
                    </li>
                    <li>
                      <strong>封入レンズ型:</strong> ビーズ上部が保護用の透明アクリル樹脂層（<code>n ≈ 1.5</code>）で覆われているため、境界の屈折率比が小さくなります。そのため、樹脂層からビーズ内への屈折で裏面に焦点を結ぶには、ビーズ自体の最適屈折率は <strong>n ≈ 1.9</strong> に補正されます。
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* プリズム型の数理 */}
            <div className="academy-card">
              <div className="academy-card-header">
                <span className="structure-label prism-label">プリズム方式</span>
                <h4>直交三面鏡によるベクトル反射</h4>
              </div>
              <div className="academy-card-body">
                <p>
                  コーナーキューブは、互いに直交する3つの反射鏡面（x=0, y=0, z=0面）で構成されています。
                </p>

                <div className="formula-box">
                  <h5>鏡面反射の反射方程式</h5>
                  <code>{"u' = u - 2(u · n)n"}</code>
                  <p className="formula-desc">
                    入射光の単位ベクトル <code>u</code>、反射面の法線ベクトル <code>n</code> に対する反射後の光線ベクトル <code>u'</code> の計算。
                  </p>
                </div>

                <div className="formula-box">
                  <h5>3回連続反射による完全反転証明</h5>
                  <div className="vector-steps">
                    <div>1. 面 X (法線 <code>nx = (1, 0, 0)</code>) で反射: <code>{"u' = (-ux, uy, uz)"}</code></div>
                    <div>2. 面 Y (法線 <code>ny = (0, 1, 0)</code>) で反射: <code>{"u'' = (-ux, -uy, uz)"}</code></div>
                    <div>3. 面 Z (法線 <code>nz = (0, 0, 1)</code>) で反射: <code>{"u''' = (-ux, -uy, -uz)"}</code></div>
                  </div>
                  <p className="formula-desc">
                    各座標軸に対応する法線面で反射するたびに、ベクトルの各軸成分が1つずつマイナス反転し、
                    最終的な反射光の方向ベクトルは <strong>{"u''' = -u"}</strong> となります。
                    これにより、入射角がどのような角度であっても、光は必ず光源の座標へと完全に戻ります。
                  </p>
                </div>

                <div className="academy-comparison">
                  <h5>全反射 (Total Internal Reflection) 条件</h5>
                  <p>
                    プリズム背面は金属蒸着されておらず、アクリル(PMMA)などの樹脂と裏面空気層との屈折率差を利用して100%全反射させています。
                    アクリルの屈折率 <code>n_p ≈ 1.49</code> のとき、臨界角は <code>θc = arcsin(1.0 / 1.49) ≈ 42.1°</code> となり、
                    これより大きな入射角でアクリルと空気の界面に到達した光が全反射します。入射角が40°を超えるとこの臨界角を維持できず光が外部に突き抜けてしまい、反射不能（NG）となります。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ビーズ型 vs プリズム型の設計比較表 */}
          <div className="academy-comparison-table-box">
            <h4 className="table-title">ガラスビーズ型 vs プリズム型 徹底設計比較</h4>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>比較項目</th>
                  <th>ガラスビーズ型</th>
                  <th>プリズム型 (一般)</th>
                  <th>フルキューブプリズム型</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>再帰反射の原理</th>
                  <td>屈折（レンズ）と鏡面反射</td>
                  <td>直交三面鏡での全反射（TIR）</td>
                  <td>直交三面鏡での全反射（TIR）</td>
                </tr>
                <tr>
                  <th>比反射輝度 (RA) 目安</th>
                  <td>50 〜 120 cd/lx/m²</td>
                  <td>300 〜 500 cd/lx/m²</td>
                  <td>800 〜 1000 cd/lx/m²</td>
                </tr>
                <tr>
                  <th>有効反射面積率</th>
                  <td>球面上の一点（焦点）のみ</td>
                  <td>約 60%（余剰デッドスペースあり）</td>
                  <td>ほぼ 100%（デッドスペース排除）</td>
                </tr>
                <tr>
                  <th>広角性（斜め反射）</th>
                  <td>極めて優秀（球対称性による）</td>
                  <td>並（特定角度で反射漏れあり）</td>
                  <td>優秀（プリズムの多方向配向）</td>
                </tr>
                <tr>
                  <th>水滴・降雨の影響</th>
                  <td>封入・カプセル型以外は著しく低下</td>
                  <td>カプセル構造または単層化で保護</td>
                  <td>カプセル構造で保護</td>
                </tr>
                <tr>
                  <th>主な用途</th>
                  <td>衣類、工事看板、安価な標識</td>
                  <td>標準的な道路案内標識</td>
                  <td>高速道路、視認性が命の主要標識</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
