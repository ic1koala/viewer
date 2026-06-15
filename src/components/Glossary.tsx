import React, { useState, useMemo } from 'react';
import { glossaryData, type Term } from '../data/glossary';

export const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<string>('all');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  // カテゴリ一覧
  const categories = [
    { value: 'all', label: 'すべてのカテゴリ' },
    { value: 'physics', label: '物理・光学' },
    { value: 'measurement', label: '測定幾何学' },
    { value: 'structure', label: '構造・設計' },
    { value: 'security', label: 'セキュリティ' },
    { value: 'standards', label: '規格・規制' },
    { value: 'env', label: '性能・環境' },
  ];

  // 五十音・アルファベットのインデックスボタンの定義
  const indexButtons = [
    { value: 'all', label: 'すべて' },
    { value: 'あ', label: 'あ' },
    { value: 'か', label: 'か' },
    { value: 'さ', label: 'さ' },
    { value: 'た', label: 'た' },
    { value: 'な', label: 'な' },
    { value: 'は', label: 'は' },
    { value: 'ま', label: 'ま' },
    { value: 'や', label: 'や' },
    { value: 'ら', label: 'ら' },
    { value: 'わ', label: 'わ' },
    { value: 'english', label: 'A-Z' },
  ];

  // 用語が指定されたインデックス（五十音グループまたはアルファベット）に属するか判定
  const matchesIndex = (term: Term, index: string): boolean => {
    if (index === 'all') return true;
    
    const reading = term.reading;
    const firstChar = reading.charAt(0);

    if (index === 'english') {
      // アルファベットで始まる場合
      return /^[a-zA-Z]/.test(term.name) || /^[a-zA-Z]/.test(term.english);
    }

    // 五十音グループ判定
    const hiraganaGroups: Record<string, string[]> = {
      'あ': ['あ', 'い', 'う', 'え', 'お'],
      'か': ['か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
      'さ': ['さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
      'た': ['た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど'],
      'な': ['な', 'に', 'ぬ', 'ね', 'の'],
      'は': ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
      'ま': ['ま', 'み', 'む', 'め', 'も'],
      'や': ['や', 'ゆ', 'よ'],
      'ら': ['ら', 'り', 'る', 'れ', 'ろ'],
      'わ': ['わ', 'を', 'ん'],
    };

    return hiraganaGroups[index]?.includes(firstChar) || false;
  };

  // フィルタリング処理
  const filteredTerms = useMemo(() => {
    return glossaryData.filter((term) => {
      // 検索バー絞り込み
      const matchesSearch =
        term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.reading.includes(searchQuery) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.details.toLowerCase().includes(searchQuery.toLowerCase());

      // カテゴリ絞り込み
      const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;

      // インデックス絞り込み
      const matchesIdx = matchesIndex(term, selectedIndex);

      return matchesSearch && matchesCat && matchesIdx;
    });
  }, [searchQuery, selectedCategory, selectedIndex]);

  const toggleExpand = (id: string) => {
    setExpandedTermId(expandedTermId === id ? null : id);
  };

  return (
    <div className="glossary-container">
      <div className="glossary-header">
        <h2 className="section-title">再帰反射専門用語集</h2>
        <p className="section-subtitle">
          再帰反射の光学理論、製品構造、規格、試験方法などを網羅的に検索・学習できるインタラクティブ用語データベースです。
        </p>
      </div>

      {/* 検索・フィルタツールバー */}
      <div className="filter-toolbar">
        {/* 検索入力 */}
        <div className="search-box-wrapper">
          <input
            type="text"
            placeholder="用語、キーワード、英語表記で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* カテゴリセレクト */}
        <div className="category-filter-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* インデックス検索（五十音 / アルファベット） */}
      <div className="index-bar">
        {indexButtons.map((btn) => (
          <button
            key={btn.value}
            className={`index-btn ${selectedIndex === btn.value ? 'active' : ''}`}
            onClick={() => setSelectedIndex(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 用語リスト表示 */}
      <div className="terms-list-wrapper">
        <div className="results-count">
          該当件数: <strong>{filteredTerms.length}</strong> 件
        </div>

        {filteredTerms.length > 0 ? (
          <div className="terms-grid">
            {filteredTerms.map((term) => {
              const isExpanded = expandedTermId === term.id;
              
              let catLabel = '';
              let catClass = '';
              switch (term.category) {
                case 'physics': catLabel = '物理・光学'; catClass = 'cat-physics'; break;
                case 'measurement': catLabel = '測定幾何学'; catClass = 'cat-measurement'; break;
                case 'structure': catLabel = '構造・設計'; catClass = 'cat-structure'; break;
                case 'security': catLabel = 'セキュリティ'; catClass = 'cat-security'; break;
                case 'standards': catLabel = '規格・規制'; catClass = 'cat-standards'; break;
                case 'env': catLabel = '性能・環境'; catClass = 'cat-env'; break;
              }

              return (
                <div
                  key={term.id}
                  className={`term-card ${isExpanded ? 'expanded' : ''}`}
                >
                  <div
                    className="term-card-header"
                    onClick={() => toggleExpand(term.id)}
                  >
                    <div className="term-title-block">
                      <span className={`category-badge ${catClass}`}>{catLabel}</span>
                      <h3 className="term-name">
                        {term.name}
                        {term.symbol && <span className="term-symbol"> ({term.symbol})</span>}
                      </h3>
                      <span className="term-reading">{term.reading} / {term.english}</span>
                    </div>
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                  </div>
                  
                  <div className="term-card-body">
                    <p className="term-definition">{term.definition}</p>
                    {term.details && (
                      <div className="term-details">
                        <span className="details-heading">技術・実用解説:</span>
                        <p>{term.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>条件に合致する専門用語が見つかりません。検索ワードを変更してみてください。</p>
          </div>
        )}
      </div>
    </div>
  );
};
