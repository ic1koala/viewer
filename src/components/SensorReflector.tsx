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

      {/* 新設：アカデミック解説（位相差と偏光回転の数理物理） */}
      <div className="section-divider"></div>
      
      <div className="academic-polarization-section">
        <h3>🎓 【学術解析】全反射における位相差と偏光回転の物理学</h3>
        <p>
          直交三面鏡（コーナーキューブ）が直線偏光の振動方向を幾何学的に90度回転させて戻すプロセスの背後には、電磁気学における**「全反射時のフレネル位相差（Fresnel Phase Shift）」**と**「3次元座標系における偏光ベクトルの幾何学的変換」**の2つの物理現象が作用しています。
        </p>

        <div className="academic-theory-grid">
          <div className="theory-box">
            <h4>1. 全反射におけるフレネル位相シフトの発生</h4>
            <p>
              光が屈折率 {"$n_1$"} （アクリル等の透明媒体）の内部から屈折率 {"$n_2 = 1.0$"} （空気層）の境界へ、臨界角 {"$\theta_c = \arcsin(1/n_1)$"} より大きな入射角 {"$\theta_i$"} で全反射するとき、マクスウェル方程式の境界条件を満たすために、反射波の電気ベクトルの位相がずれます。
            </p>
            <p>
              このとき、入射面に平行な電場成分（P波）の位相変化 {"$\delta_p$"} と、垂直な電場成分（S波）の位相変化 {"$\delta_s$"} は等しくなく、フレネルの式より以下の位相差方程式が成り立ちます。
            </p>
            <div className="math-formula-box">
              {"\\[ \\tan\\left(\\frac{\\delta_p}{2}\\right) = -\\frac{\\sqrt{\\sin^2\\theta_i - (1/n_1)^2}}{(1/n_1)^2\\cos\\theta_i} \\]"}
              {"\\[ \\tan\\left(\\frac{\\delta_s}{2}\\right) = -\\frac{\\sqrt{\\sin^2\\theta_i - (1/n_1)^2}}{\\cos\\theta_i} \\]"}
            </div>
            <p>
              この2成分のずれにより、1回の全反射ごとに生じる位相差 {"$\Delta = \delta_p - \delta_s$"} は以下のように計算されます。
            </p>
            <div className="math-formula-box">
              {"\\[ \\tan\\left(\\frac{\\Delta}{2}\\right) = \\frac{\\cos\\theta_i \\sqrt{\\sin^2\\theta_i - (1/n_1)^2}}{\\sin^2\\theta_i} \\]"}
            </div>
            <p>
              アクリル（{"$n_1 \\approx 1.49$"}）で成形されたコーナーキューブにおいて、内部全反射時の入射角は幾何学的に {"$\\theta_i \\approx 54.7^\\circ$"} となり、このときの1回あたりの位相差 {"$\\Delta$"} は約 {"$45^\\circ \\sim 50^\\circ$"} に達します。この位相変化により、入射した直線偏光は、1回反射するごとに楕円偏光へと変化します。
            </p>
          </div>

          <div className="theory-box">
            <h4>2. 三次元直交反射による幾何学的偏光の回転</h4>
            <p>
              コーナーキューブ内では、光線が直交する3つの鏡面（{"$x=0, y=0, z=0$"}）で3回連続して全反射します。
              各面における局所的な入射面（P波・S波の基準軸）は、プリズムの進行方向に沿って互いに直交しているため、反射するたびに電気ベクトルの成分が反転します。
            </p>
            <p>
              この3次元座標回転の幾何学的効果と、3回の全反射によって累積される総位相差 {"$\\Delta_{\\text{total}} = 3 \\times \\Delta \\approx 140^\\circ \\sim 150^\\circ$"} が足し合わされることで、最終的な戻り光は、入射した直線偏光の振動方向（S偏光：横偏光）に対して**ちょうど垂直な振動方向の成分（P偏光：縦偏光）**へと幾何学的に変換されて戻ります。
            </p>
            <p>
              一方、金属缶やガラス板などのワーク表面での正反射では、位相シフトの差が小さく偏光回転が起きないため、戻り光は横偏光のままです。
              受光部の偏光フィルターがこの「90度回転した偏光成分（縦偏光）」のみを通過させることで、ワークの正反射光を完璧に遮断し、リフレクタからの光だけを検知することができます。
            </p>
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* センサー用リフレクタ製品仕様比較一覧表（中途半端な文章の表化整理） */}
      <h3 className="home-section-title">主要メーカーのセンサー用リフレクタ製品仕様一覧</h3>
      <p className="section-intro-text">
        以下は、FAラインの設計で広く使用される主要なセンサー用リフレクタの製品スペック比較表です。外形寸法、微細プリズムサイズ、および公式の製品仕様への直リンクを整理してまとめています。
      </p>

      <div className="academy-comparison-table-box">
        <table className="comparison-table sensor-spec-comparison-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>メーカー</th>
              <th style={{ width: '15%' }}>型番・シリーズ</th>
              <th style={{ width: '20%' }}>外形寸法 (厚み)</th>
              <th style={{ width: '20%' }}>プリズム形状 (ピッチ)</th>
              <th style={{ width: '20%' }}>主な特徴・光学性能</th>
              <th style={{ width: '10%' }}>詳細リンク</th>
            </tr>
          </thead>
          <tbody>
            {sensorReflectorData.map((prod) => (
              <tr key={prod.id}>
                <td><strong>{prod.manufacturer}</strong></td>
                <td><code className="table-code">{prod.modelNumber}</code></td>
                <td>{prod.size}</td>
                <td className="highlight-val-cell">{prod.prismSize}</td>
                <td>
                  <ul className="table-bullet-list">
                    {prod.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <a
                    href={prod.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="table-link-btn"
                  >
                    🔗 公式
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-divider"></div>

      {/* センサー用リフレクタと標識用シートの設計の違い */}
      <div className="academy-comparison-table-box">
        <h4 className="table-title">道路標識用反射シート vs センサー用リフレクタ 徹底比較</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>比較項目</th>
              <th style={{ width: '40%' }}>道路標識用反射シート (3M, NCIなど)</th>
              <th style={{ width: '40%' }}>光電センサー用リフレクタ (オムロン, キーエンスなど)</th>
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
