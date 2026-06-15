import React from 'react';
import { sensorReflectorData } from '../data/sensorReflectors';

export const SensorReflector: React.FC = () => {
  return (
    <div className="sensor-reflector-container animated fadeIn">
      <div className="manufacturers-header">
        <h2 className="section-title">光電センサー用リフレクタ技術</h2>
        <p className="section-subtitle">
          FA（ファクトリーオートメーション）ラインの自動制御を支える「回帰反射形光電センサー」と、その受光性能を決定づける高精度リフレクタ（反射板）の物理構造および製品データベースです。
        </p>
      </div>

      {/* 原理と画像セクション */}
      <div className="reflector-intro-grid">
        <div className="reflector-intro-text">
          <h3>回帰反射形光電センサーの仕組み</h3>
          <p>
            回帰反射形センサー（Retro-reflective Sensor）は、ひとつのハウジング内に**「投光素子（赤色LEDやレーザー）」**と**「受光素子（フォトダイオード等）」**を隣接して配置したセンサーボディと、対向して設置される**「リフレクタ（反射板）」**を対にして使用します。
          </p>
          <p>
            センサーが投射したビームがリフレクタで正確に再帰反射して受光素子に戻ることで光路が作られます。
            検出物体（ワークやパレット等）がこの光路を遮ると、受光量が低下し、センサーは「遮光状態（物体検出あり）」の信号を制御装置（PLC）へ高速出力します。
            投受光器を対向して2台設置し配線する「透過形」に比べ、<strong>配線が片側だけで済み、設置工数を大幅に削減できる</strong>のが最大の強みです。
          </p>
          
          <div className="polarization-card">
            <h4>💡 鏡面光沢物の誤検出を防ぐ「偏光特性 (M.S.R.機能)」</h4>
            <p>
              光沢のある金属（缶、アルミパレット）やプラスチック容器などの鏡面（正反射物）がセンサーの目の前を通過すると、ワーク表面で鏡面反射した強い光が受光部に戻ってしまいます。
              このときセンサーは「光が戻ってきているため、物体は存在しない」と誤検出してしまう致命的な弱点が生じます。
            </p>
            <p>
              この問題を幾何光学的に完全に解決するのが、<strong>M.S.R. (Mirror Surface Rejection：鏡面干渉除去) 機能</strong>です。
            </p>
            
            <div className="msr-steps-box">
              <h5>【M.S.R.機能のステップ別動作原理】</h5>
              <ol className="msr-steps-list">
                <li>
                  <strong>横偏光の投光:</strong>
                  投光素子の前面に偏光フィルターを配置し、光の電気ベクトルが「横方向」にしか振動しない偏光波（S偏光）としてビームを照射します。
                </li>
                <li>
                  <strong>ワーク（鏡面光沢物）での正反射:</strong>
                  ワークの滑らかな表面で正反射した光は、偏光の規則性が変わらずに<strong>「横偏光（S偏光）」のまま</strong>受光部へ戻ります。
                </li>
                <li>
                  <strong>リフレクタ（直交三面鏡）での再帰反射:</strong>
                  リフレクタ（コーナーキューブプリズム）の互いに直交する3つの境界壁面で光が3回全反射すると、幾何光学的な境界条件から、電場ベクトルが反転し、<strong>偏光方向がちょうど90度回転した「縦偏光（P偏光）」</strong>としてセンサーへ戻ります。
                </li>
                <li>
                  <strong>受光部偏光フィルターによる選別:</strong>
                  受光素子の前面には「縦方向」の偏光波しか通さないフィルターを配置します。
                  これにより、<strong>ワークからの鏡面反射（横偏光）はフィルターに遮断されて受光できず、リフレクタからの戻り光（縦偏光）だけが通過</strong>して受光されます。
                  結果として、光沢のある缶やペットボトルが光路を塞いだときも、誤検出なく「遮光（物体あり）」と判定できます。
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="reflector-image-block">
          <img
            src="./sensor_reflector.png"
            alt="光電センサーとリフレクタの動作原理イラスト"
            className="reflector-concept-img"
          />
          <span className="image-caption">回帰反射形光電センサーとリフレクタの光線路（M.S.R.機能イメージ図）</span>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* 各社製品ラインナップ */}
      <h3 className="home-section-title">主要メーカーのセンサー用リフレクタ製品カタログ</h3>
      <p className="section-intro-text">
        FAで多用される主要な成形リフレクタおよびマイクロプリズムシート製品です。センサーのレーザー・LED径、取付スペースに合わせて選定されます。詳細仕様は各公式リンクから確認できます。
      </p>
      
      <div className="reflector-products-grid">
        {sensorReflectorData.map((prod) => (
          <div key={prod.id} className="reflector-product-card">
            <div className="reflector-card-header">
              <span className="mfr-badge">{prod.manufacturer}</span>
              <h4 className="model-number">{prod.modelNumber}</h4>
            </div>
            <div className="reflector-specs">
              <div className="spec-row">
                <span className="spec-label">外形寸法:</span>
                <span className="spec-val">{prod.size}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">プリズムサイズ:</span>
                <span className="spec-val highlight-val">{prod.prismSize}</span>
              </div>
            </div>
            <p className="prod-description">{prod.description}</p>
            <div className="features-list-wrapper">
              <h5>主な特徴・光学性能:</h5>
              <ul className="bullet-list-small">
                {prod.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
            <div className="reflector-card-action">
              <a
                href={prod.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="reflector-link-btn"
              >
                🔗 公式製品サイトで確認する →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider"></div>

      {/* センサー用リフレクタと標識用シートの設計の違い */}
      <div className="academy-comparison-table-box">
        <h4 className="table-title">道路標識用反射シート vs センサー用リフレクタ 徹底比較</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>比較項目</th>
              <th>道路標識用反射シート (3M, NCIなど)</th>
              <th>光電センサー用リフレクタ (オムロン, キーエンスなど)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>素子のサイズ (ピッチ)</th>
              <td>非常に微細 (0.1mm 〜 0.3mm) / 薄型フィルム化のため</td>
              <td>比較的大きい (0.5mm 〜 2.0mm) / 光学精度・金型精度の極限化のため</td>
            </tr>
            <tr>
              <th>形状と厚み</th>
              <td>柔軟なフィルム状 (厚み 0.2mm 〜 0.5mm)</td>
              <td>硬質なプラスチック成形板 (厚み 5mm 〜 8mm) / 歪み防止</td>
            </tr>
            <tr>
              <th>偏光の保持率</th>
              <td>低い (シート成形時の歪みやカプセル樹脂により偏光が乱れる)</td>
              <td>極めて高い (偏光M.S.R.機能センサーに対応するため高精度アクリル成形)</td>
            </tr>
            <tr>
              <th>広角性 (大入射角反射)</th>
              <td>非常に重視される (斜めから走ってくる車に見せるため)</td>
              <td>並 (基本的にはセンサーと正対して配置して使用するため)</td>
            </tr>
            <tr>
              <th>反射効率の要件</th>
              <td>人間の目に見える明るさ (比反射輝度 500〜900 cd/lx/m²)</td>
              <td>センサー受光素子の閾値クリア (極めてシャープかつスポット強度の高い戻り光)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
