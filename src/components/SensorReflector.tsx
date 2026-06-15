import React from 'react';
import { sensorReflectorData } from '../data/sensorReflectors';

export const SensorReflector: React.FC = () => {
  return (
    <div className="sensor-reflector-container animated fadeIn">
      <div className="manufacturers-header">
        <h2 className="section-title">光電センサー用リフレクタ技術</h2>
        <p className="section-subtitle">
          FA（ファクトリーオートメーション）や自動化ラインの頭脳である光電センサーと、その性能を支える精密リフレクタ（反射板）の物理と製品情報を解説します。
        </p>
      </div>

      {/* 原理と画像セクション */}
      <div className="reflector-intro-grid">
        <div className="reflector-intro-text">
          <h3>回帰反射形光電センサーの仕組み</h3>
          <p>
            回帰反射形センサー（Retro-reflective Sensor）は、**「投光部」**と**「受光部」**が一体となったセンサーボディと、対向して設置される**「リフレクタ（反射板）」**で構成されます。
          </p>
          <p>
            センサーから発せられた光線（赤色LEDやレーザーなど）がリフレクタで再帰反射して受光部に戻ることで、光路が維持されます。
            ここに検出物体（パレットやワークなど）が割り込むと、光が遮られて受光量が低下し、物体の通過や有無を高速検知します。
          </p>
          
          <div className="polarization-card">
            <h4>💡 鏡面光沢物の誤検出を防ぐ「偏光特性 (M.S.R.機能)」</h4>
            <p>
              光沢のある金属や鏡のようなワークがセンサー前を通過すると、ワーク表面で鏡面反射（正反射）した光がセンサーの受光部に入ってしまい、「遮光されているのに光が戻ってきているため、物体なし」と誤判定する問題が生じます。
            </p>
            <p>
              これを防ぐのが**M.S.R. (Mirror Surface Rejection) 機能**です。
              投光部に横方向の偏光フィルタ、受光部に縦方向の偏光フィルタを配置します。
              通常の光沢物による鏡面反射では偏光方向は変わりませんが、<strong>リフレクタ（直交三面鏡コーナーキューブ）で3回全反射した光は、偏光波が幾何学的に90度回転して縦方向の偏光</strong>となります。
              これにより、リフレクタからの戻り光だけを受光部が通し、ワークからの反射光はシャットアウトして誤検出を完全に防止します。
            </p>
          </div>
        </div>
        
        <div className="reflector-image-block">
          <img
            src="./sensor_reflector.png"
            alt="光電センサーとリフレクタの動作原理イラスト"
            className="reflector-concept-img"
          />
          <span className="image-caption">回帰反射形光電センサーとリフレクタの光線路（イメージ図）</span>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* 各社製品ラインナップ */}
      <h3 className="home-section-title">主要メーカーのリフレクタ製品ラインナップ</h3>
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
              <h5>主な特徴・技術:</h5>
              <ul className="bullet-list-small">
                {prod.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider"></div>

      {/* センサー用リフレクタと標識用シートの設計の違い */}
      <div className="academy-comparison-table-box">
        <h4 className="table-title">道路標識用シート vs センサー用リフレクタ 徹底比較</h4>
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
