import { useState } from 'react';
import { Simulator } from './components/Simulator';
import { Manufacturers } from './components/Manufacturers';
import { SensorReflector } from './components/SensorReflector';
import { Glossary } from './components/Glossary';
import { Quiz } from './components/Quiz';
import './App.css';

type AppTab = 'home' | 'simulator' | 'manufacturers' | 'sensor_reflector' | 'glossary' | 'quiz';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="home-content animated fadeIn">
            {/* ヒーローセクション */}
            <div className="hero-section">
              <div className="hero-text-block">
                <span className="hero-badge">💡 光学技術の探求</span>
                <h1 className="hero-title">再帰反射シート<br />学習アカデミー</h1>
                <p className="hero-desc">
                  暗闇で光源に向けて光を正確に跳ね返す「再帰反射」。ガラスビーズの幾何光学から、
                  最新のフルキューブプリズム構造、主要メーカー（3M, Orafol, NCI）の特許技術まで、
                  エンジニア・研究者レベルの専門知識を網羅的に学習できるプラットフォームです。
                </p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => setActiveTab('simulator')}>
                    シミュレーターを試す
                  </button>
                  <button className="secondary-btn" onClick={() => setActiveTab('manufacturers')}>
                    主要メーカー分析を見る
                  </button>
                </div>
              </div>
              <div className="hero-graphics-block">
                {/* 簡易的な再帰反射の幾何概念図（SVG） */}
                <svg viewBox="0 0 200 200" className="hero-svg">
                  <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(14, 165, 233, 0.4)" />
                      <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
                    </radialGradient>
                  </defs>
                  {/* 背景のグリッド */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                  {/* 反射材（プリズム面） */}
                  <polygon points="90,120 110,120 100,105" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" />
                  <polygon points="70,120 90,120 80,105" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" />
                  <polygon points="110,120 130,120 120,105" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" />
                  {/* 発光グロー */}
                  <circle cx="100" cy="112" r="35" fill="url(#glow)" />
                  {/* 光源（ヘッドライト） */}
                  <circle cx="40" cy="50" r="8" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
                  <circle cx="40" cy="50" r="16" fill="none" stroke="rgba(254, 240, 138, 0.4)" strokeWidth="1" />
                  {/* ドライバーの目 */}
                  <circle cx="45" cy="30" r="6" fill="#6366f1" />
                  {/* 光線（照射） */}
                  <line x1="40" y1="50" x2="100" y2="112" stroke="#eab308" strokeWidth="2.5" />
                  {/* 光線（反射） */}
                  <line x1="100" y1="112" x2="45" y2="30" stroke="#6366f1" strokeWidth="2.5" />
                  {/* ラベル */}
                  <text x="30" y="75" fill="#d97706" fontSize="8" fontWeight="bold" fontFamily="Outfit">照射軸 (Light)</text>
                  <text x="55" y="25" fill="#4f46e5" fontSize="8" fontWeight="bold" fontFamily="Outfit">観測軸 (Eye)</text>
                  <text x="135" y="130" fill="#0284c7" fontSize="8" fontWeight="bold" fontFamily="Outfit">反射素子</text>
                </svg>
              </div>
            </div>

            {/* 基本反射タイプ解説カード */}
            <div className="section-divider"></div>
            
            <h2 className="home-section-title">反射の種類と違い</h2>
            <div className="reflection-types-grid">
              <div className="concept-card">
                <span className="concept-badge specular-badge">正反射 (Specular)</span>
                <h4>鏡面反射</h4>
                <p>
                  光が入射角と等しい反射角の方向（一方向）へ規則正しく反射する現象です。
                  鏡や水面、滑らかな金属板などで見られます。光源から外れた位置の観測者には全く光って見えません。
                </p>
              </div>
              <div className="concept-card">
                <span className="concept-badge diffuse-badge">乱反射 (Diffuse)</span>
                <h4>拡散反射</h4>
                <p>
                  光が反射面の凹凸によって、あらゆる方向へランダムに散乱する現象です。
                  白い壁や紙、通常の衣類などで見られます。どの角度からも見えますが、光源方向へ戻る光はごく僅かなため、夜間は非常に暗くなります。
                </p>
              </div>
              <div className="concept-card highlight-card">
                <span className="concept-badge retro-badge">再帰反射 (Retro)</span>
                <h4>再帰反射</h4>
                <p>
                  光が入射した角度に関わらず、光が入ってきた方向（光源）へ集中して真っ直ぐ戻る現象です。
                  夜間にヘッドライトを点灯したドライバーから標識や安全ベストが劇的に明るく視認できるのは、この再帰反射を利用しているためです。
                </p>
              </div>
            </div>

            {/* コンテンツナビカード */}
            <div className="section-divider"></div>
            
            <h2 className="home-section-title">学習コンテンツを選択</h2>
            <div className="content-nav-grid">
              <div className="nav-card" onClick={() => setActiveTab('simulator')}>
                <div className="nav-card-icon">🎛️</div>
                <h3>反射シミュレーター</h3>
                <p>観測角・入射角・車両タイプ・シートの種類をスライダーで変更し、反射の様子を動的にシミュレートします。</p>
                <span className="nav-link-text">シミュレーターを開く →</span>
              </div>
              
              <div className="nav-card" onClick={() => setActiveTab('manufacturers')}>
                <div className="nav-card-icon">🔬</div>
                <h3>メーカー分析 ＆ アカデミー</h3>
                <p>3M・Orafol・NCI の全製品ラインナップ、コア特許、およびスネルの法則や直交ベクトル計算の数理を学びます。</p>
                <span className="nav-link-text">メーカー分析を開く →</span>
              </div>

              <div className="nav-card" onClick={() => setActiveTab('sensor_reflector')}>
                <div className="nav-card-icon">📡</div>
                <h3>光電センサー用反射板</h3>
                <p>FAラインで使用されるオムロンやキーエンスなどの光電センサー用リフレクタ技術、および偏光M.S.R.特性を学びます。</p>
                <span className="nav-link-text">センサー用技術を開く →</span>
              </div>
              
              <div className="nav-card" onClick={() => setActiveTab('glossary')}>
                <div className="nav-card-icon">📖</div>
                <h3>専門用語集</h3>
                <p>測定パラメータ（観測角、比反射輝度係数など）や物理光学の用語をカテゴリ別・五十音別に検索できます。</p>
                <span className="nav-link-text">用語集を開く →</span>
              </div>
              
              <div className="nav-card" onClick={() => setActiveTab('quiz')}>
                <div className="nav-card-icon">📝</div>
                <h3>理解度テスト</h3>
                <p>再帰反射シートの技術的知識を問う選択式クイズに挑戦し、理解度レベル（ランク）を測定します。</p>
                <span className="nav-link-text">クイズに挑戦する →</span>
              </div>
            </div>
          </div>
        );
      case 'simulator':
        return <Simulator />;
      case 'manufacturers':
        return <Manufacturers />;
      case 'sensor_reflector':
        return <SensorReflector />;
      case 'glossary':
        return <Glossary />;
      case 'quiz':
        return <Quiz />;
    }
  };

  return (
    <div className="app-wrapper sidebar-layout">
      {/* モバイルヘッダー（レスポンシブ用） */}
      <header className="mobile-header">
        <div className="logo-area" onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}>
          <span className="logo-icon">💫</span>
          <span className="logo-text">Retro-reflective</span>
        </div>
        <button className="menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* 左サイドバー */}
      <aside className={`global-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-sticky">
          <div className="logo-area" onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}>
            <span className="logo-icon">💫</span>
            <span className="logo-text">Retro-reflective<br /><span className="logo-sub">Academy</span></span>
          </div>

          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            >
              🏠 ホーム
            </button>
            <button
              className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => { setActiveTab('simulator'); setMobileMenuOpen(false); }}
            >
              🎛️ シミュレーター
            </button>
            <button
              className={`nav-item ${activeTab === 'manufacturers' ? 'active' : ''}`}
              onClick={() => { setActiveTab('manufacturers'); setMobileMenuOpen(false); }}
            >
              🔬 メーカー ＆ アカデミー
            </button>
            <button
              className={`nav-item ${activeTab === 'sensor_reflector' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sensor_reflector'); setMobileMenuOpen(false); }}
            >
              📡 センサー用反射板
            </button>
            <button
              className={`nav-item ${activeTab === 'glossary' ? 'active' : ''}`}
              onClick={() => { setActiveTab('glossary'); setMobileMenuOpen(false); }}
            >
              📖 専門用語集
            </button>
            <button
              className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => { setActiveTab('quiz'); setMobileMenuOpen(false); }}
            >
              📝 理解度テスト
            </button>
          </nav>

          <div className="sidebar-info-box">
            <span className="info-title">💡 学びのヒント</span>
            <p className="info-body">
              シミュレーターで「観測角」を変更してみましょう。トラックや近距離での見え方の違いが視覚的に理解できます！
            </p>
          </div>
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="main-layout-wrapper">
        <main className="main-content-area">
          <div className="content-container">
            {renderTabContent()}
          </div>
        </main>

        {/* フッター */}
        <footer className="global-footer">
          <div className="footer-container">
            <p>© 2026 再帰反射シート学習アカデミー - retroreflective-study</p>
            <p className="footer-sub">3M / ORAFOL / 日本カーバイド工業（NCI）/ 各社センサーリフレクタの技術リサーチデータに基づく学習ツール</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
