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
          再帰反射シート市場を独占する3大メーカーの徹底比較と、数式を用いた光学技術の深掘り学習が可能です。
        </p>
      </div>

      {/* サブセクション切り替え */}
      <div className="sub-section-tabs">
        <button
          className={`sub-tab-btn ${!academyMode ? 'active' : ''}`}
          onClick={() => setAcademyMode(false)}
        >
          主要メーカー比較
        </button>
        <button
          className={`sub-tab-btn ${academyMode ? 'active' : ''}`}
          onClick={() => setAcademyMode(true)}
        >
          技術アカデミー (数理光学)
        </button>
      </div>

      {!academyMode ? (
        <div className="mfr-layout">
          {/* メーカー選択サイドバー（タブ） */}
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
            <h3 className="mfr-full-title">{selectedMfr.fullName}</h3>
            
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
              <h4 className="box-title">性能レーティング (各社比)</h4>
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

            {/* 歴史・概要 */}
            <div className="detail-section">
              <h4 className="section-heading-small">沿革と開発の歴史</h4>
              <p className="section-body-text">{selectedMfr.history}</p>
            </div>

            {/* 技術詳細 */}
            <div className="detail-section">
              <h4 className="section-heading-small">核心技術: {selectedMfr.coreTech}</h4>
              <p className="section-body-text">{selectedMfr.coreTechDesc}</p>
            </div>

            {/* 主な強みリスト */}
            <div className="detail-section">
              <h4 className="section-heading-small">製品の主な強み</h4>
              <ul className="bullet-list">
                {selectedMfr.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>

            {/* 代表製品 */}
            <div className="detail-section">
              <h4 className="section-heading-small">代表的な製品ラインナップ</h4>
              <div className="products-grid">
                {selectedMfr.products.map((p, i) => (
                  <div key={i} className="product-card">
                    <span className="product-type-badge">{p.type}</span>
                    <h5 className="product-name">{p.name}</h5>
                    <p className="product-desc">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 特許情報 */}
            <div className="detail-section">
              <h4 className="section-heading-small">保有する主要特許技術</h4>
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
              <h4 className="section-heading-small">主な導入先・用途</h4>
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
                  <p className="formula-desc">異なる屈折率の境界を光が通過する際の基本法則。</p>
                </div>

                <div className="formula-box">
                  <h5>球面屈折公式 (近軸近似)</h5>
                  <code>n₁/s + n/s' = (n - n₁)/R</code>
                  <p className="formula-desc">
                    曲率半径 <code>R</code> の球面における像点距離 <code>s'</code> を求める式。
                    平行光線（<code>s = ∞</code>）、外部媒質が空気（<code>n₁ = 1.0</code>）のとき、
                    像がビーズの裏面（<code>s' = 2R</code>）に結ばれる条件は、屈折率が <strong>n = 2.0</strong> のときになります。
                  </p>
                </div>

                <div className="academy-comparison">
                  <h5>実製品の屈折率補正</h5>
                  <ul>
                    <li>
                      <strong>露出レンズ型:</strong> ビーズの上部が空気に直接触れているため、最適屈折率は理論値に近い <strong>n ≈ 2.2</strong> 程度に設計されます。
                    </li>
                    <li>
                      <strong>封入レンズ型:</strong> ビーズの上部が透明樹脂（<code>n ≈ 1.5</code>）で覆われているため、屈折率比の計算からビーズ自体の最適屈折率は <strong>n ≈ 1.9</strong> になります。
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
                  コーナーキューブは、互いに直交する3つの鏡（x=0, y=0, z=0面）で構成されています。
                </p>

                <div className="formula-box">
                  <h5>鏡面反射の反射方程式</h5>
                  <code>{"u' = u - 2(u · n)n"}</code>
                  <p className="formula-desc">
                    入射ベクトル <code>u</code>、面法線 <code>n</code> に対する反射後のベクトル <code>u'</code> の計算。
                  </p>
                </div>

                <div className="formula-box">
                  <h5>3回連続反射による反転ベクトル</h5>
                  <div className="vector-steps">
                    <div>1. 面 A (x=0) 反射: <code>{"u' = (-ux, uy, uz)"}</code></div>
                    <div>2. 面 B (y=0) 反射: <code>{"u'' = (-ux, -uy, uz)"}</code></div>
                    <div>3. 面 C (z=0) 反射: <code>{"u''' = (-ux, -uy, -uz)"}</code></div>
                  </div>
                  <p className="formula-desc">
                    結果として、最終的な反射光の方向ベクトルは <strong>{"u''' = -u"}</strong> となり、
                    入射した光はどんな角度でも完全に光源方向へ戻ることが数理的に証明されます。
                  </p>
                </div>

                <div className="academy-comparison">
                  <h5>全反射 (Total Internal Reflection) 条件</h5>
                  <p>
                    プリズムの背面は金属蒸着されておらず、アクリルなどの樹脂と外部の空気層との屈折率差を利用して100%全反射させています。
                    臨界角 <code>θc = arcsin(1.0 / n_p)</code> を超える入射角の場合に全反射が成り立ちます。
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
