import React, { useState, useEffect } from 'react';
import { quizQuestions, type Question } from '../data/quiz';

const LOCAL_STORAGE_KEY = 'retro_reflective_quiz_wrong_ids';

export const Quiz: React.FC = () => {
  // 状態変数
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [quizMode, setQuizMode] = useState<'normal' | 'review'>('normal');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  
  // 過去の間違えた問題のIDリスト (localStorageで永続化)
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);

  // 初期ロード時にlocalStorageから間違えた問題リストを復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setWrongQuestionIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse wrong question IDs from localStorage', e);
    }
  }, []);

  // 配列をランダムにシャッフルするヘルパー
  const shuffleQuestions = (arr: Question[]): Question[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // クイズ開始処理
  const startQuiz = (mode: 'normal' | 'review') => {
    setQuizMode(mode);
    let selectedSet: Question[] = [];

    if (mode === 'normal') {
      // 全40問からランダムに10問を抽出
      const shuffled = shuffleQuestions(quizQuestions);
      selectedSet = shuffled.slice(0, 10);
    } else {
      // やり直しモード: 間違えた問題を優先
      const wrongSet = quizQuestions.filter((q) => wrongQuestionIds.includes(q.id));
      const otherSet = quizQuestions.filter((q) => !wrongQuestionIds.includes(q.id));

      if (wrongSet.length >= 10) {
        // 間違えた問題が10問以上ある場合は、その中からランダムに10問
        selectedSet = shuffleQuestions(wrongSet).slice(0, 10);
      } else {
        // 間違えた問題が10問未満の場合は、すべて含めて残りを他の問題から補填
        const needed = 10 - wrongSet.length;
        const shuffledOthers = shuffleQuestions(otherSet);
        const fillers = shuffledOthers.slice(0, needed);
        selectedSet = shuffleQuestions([...wrongSet, ...fillers]);
      }
    }

    setActiveQuestions(selectedSet);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setIsStarted(true);
  };

  const handleOptionClick = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(optionIdx);
  };

  // 回答確定時
  const handleSubmit = () => {
    if (selectedAnswer === null || isSubmitted) return;
    
    setIsSubmitted(true);
    const currentQuestion = activeQuestions[currentIdx];
    const isCorrect = selectedAnswer === currentQuestion.answerIndex;

    let updatedWrongIds = [...wrongQuestionIds];

    if (isCorrect) {
      setScore((prev) => prev + 1);
      // 正解した場合、間違えた問題リストから削除
      updatedWrongIds = updatedWrongIds.filter((id) => id !== currentQuestion.id);
    } else {
      // 不正解の場合、間違えた問題リストに追加
      if (!updatedWrongIds.includes(currentQuestion.id)) {
        updatedWrongIds.push(currentQuestion.id);
      }
    }

    setWrongQuestionIds(updatedWrongIds);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWrongIds));
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleGoToStart = () => {
    setIsStarted(false);
    setQuizFinished(false);
  };

  // 10問中何点かによる評価ランク
  const getRankInfo = (finalScore: number) => {
    const ratio = finalScore / 10;
    if (ratio === 1.0) {
      return {
        title: "✨ 再帰反射マスター (輝度100%!)",
        desc: "素晴らしい！10問すべての難解な物理・特許クイズに完璧に正解しました。再帰反射の幾何光学や各社特許技術について、最高峰の専門知識を持っています。",
        colorClass: "rank-master"
      };
    } else if (ratio >= 0.7) {
      return {
        title: "🔬 プリズム級エンジニア",
        desc: "優秀な成績です！再帰反射の高度な物理公式や、メーカー各社の構造特徴（単層・カプセル）、FAセンサー用の偏光特性を深く理解できています。",
        colorClass: "rank-expert"
      };
    } else if (ratio >= 0.4) {
      return {
        title: "🔮 カプセルレンズ級（中級技術者）",
        desc: "合格ラインです。基本の測定幾何学や構造は理解できています。偏光解消の抑制や金型切削、特許仕様などの専門事項についてさらに復習してみましょう。",
        colorClass: "rank-normal"
      };
    } else {
      return {
        title: "💡 ガラスビーズ級（基礎習得中）",
        desc: "基礎的な知識は定着しつつありますが、全反射の臨界角条件や、アニール処理、特許技術にまだ苦手な部分があるようです。間違えた問題を「やり直しテスト」で反復学習してみましょう！",
        colorClass: "rank-novice"
      };
    }
  };

  const currentQuestion = activeQuestions[currentIdx];
  const rank = getRankInfo(score);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="section-title">再帰反射知識 理解度テスト</h2>
        <p className="section-subtitle">
          物理光学、JIS/ASTM測定幾何学、主要3社の特許技術、および光電センサー用リフレクタ技術の専門知識を測定します。
        </p>
      </div>

      {/* 1. スタート・モード選択画面 */}
      {!isStarted && (
        <div className="quiz-start-screen animated fadeIn">
          <div className="quiz-start-card">
            <span className="start-badge">🎯 知識の総仕上げ</span>
            <h3>理解度測定テスト (全40問プール搭載)</h3>
            <p className="start-desc">
              再帰反射の専門データベースからランダムに10問が出題されるテストです。物理原理、特許、FA制御など幅広く出題されます。
            </p>

            <div className="wrong-questions-tracker">
              <div className="tracker-header">
                <span className="tracker-icon">📝</span>
                <h4>苦手克服ステータス</h4>
              </div>
              <p>
                現在記録されている間違えた問題数: <strong>{wrongQuestionIds.length}</strong> 問 / 40問中
              </p>
              <div className="tracker-progress">
                <div 
                  className="tracker-progress-fill" 
                  style={{ width: `${(wrongQuestionIds.length / 40) * 100}%` }}
                ></div>
              </div>
              <span className="tracker-note">※間違えた問題は、やり直しテストで克服（正解）すると自動的にリストから削除されます。</span>
            </div>

            <div className="quiz-start-actions">
              <button 
                className="quiz-start-btnprimary" 
                onClick={() => startQuiz('normal')}
              >
                🏁 通常テストを開始 (ランダム10問)
              </button>
              
              <button 
                className={`quiz-start-btnsecondary ${wrongQuestionIds.length === 0 ? 'btn-disabled' : ''}`}
                onClick={() => wrongQuestionIds.length > 0 && startQuiz('review')}
                disabled={wrongQuestionIds.length === 0}
              >
                🔄 やり直しテストを開始 (苦手優先・10問)
              </button>
            </div>
            {wrongQuestionIds.length === 0 && (
              <p className="disabled-btn-guide">※一度通常テストを受け、間違えた問題が発生すると「やり直しテスト」が選択可能になります。</p>
            )}
          </div>
        </div>
      )}

      {/* 2. クイズ実行中画面 */}
      {isStarted && !quizFinished && (
        <div className="quiz-card animated fadeIn">
          {/* プログレスバー */}
          <div className="quiz-progress-bar-wrapper">
            <div className="progress-text">
              {quizMode === 'review' ? (
                <span className="mode-indicator review-mode">🔄 やり直しモード</span>
              ) : (
                <span className="mode-indicator normal-mode">🏁 通常モード</span>
              )}
              問題 <strong>{currentIdx + 1}</strong> / 10
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 問題文 */}
          <div className="quiz-question-wrapper">
            <h3 className="quiz-question-text">{currentQuestion.question}</h3>
          </div>

          {/* 選択肢リスト */}
          <div className="quiz-options-list">
            {currentQuestion.options.map((option, idx) => {
              let optionClass = "";
              
              if (isSubmitted) {
                if (idx === currentQuestion.answerIndex) {
                  optionClass = "correct-option"; // 正解
                } else if (idx === selectedAnswer) {
                  optionClass = "incorrect-option"; // 間違えた選択
                } else {
                  optionClass = "disabled-option";
                }
              } else if (idx === selectedAnswer) {
                optionClass = "selected-option";
              }

              return (
                <button
                  key={idx}
                  className={`quiz-option-btn ${optionClass}`}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isSubmitted}
                >
                  <span className="option-indicator">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>

          {/* アクション＆解説エリア */}
          <div className="quiz-actions-explanation">
            {!isSubmitted ? (
              <button
                className="quiz-submit-btn"
                disabled={selectedAnswer === null}
                onClick={handleSubmit}
              >
                回答を確定する
              </button>
            ) : (
              <div className="explanation-box animated fadeIn">
                <div className="result-indicator-banner">
                  {selectedAnswer === currentQuestion.answerIndex ? (
                    <span className="result-correct-label">⭕ 正解！</span>
                  ) : (
                    <span className="result-incorrect-label">❌ 不正解... (苦手リストに記録しました)</span>
                  )}
                </div>
                <h4 className="explanation-title">解説:</h4>
                <p className="explanation-body">{currentQuestion.explanation}</p>
                <button className="quiz-next-btn" onClick={handleNext}>
                  {currentIdx + 1 < 10 ? '次の問題へ' : 'テストを終了して結果を見る'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. クイズ完了結果画面 */}
      {isStarted && quizFinished && (
        <div className="quiz-result-card animated scaleIn">
          <h3 className="result-title">
            {quizMode === 'review' ? 'やり直しテスト 結果発表' : '通常テスト 結果発表'}
          </h3>
          
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <span className="score-num">{score}</span>
              <span className="score-total">/ 10</span>
            </div>
            <p className="score-subtext">正解数</p>
          </div>

          <div className={`rank-card ${rank.colorClass}`}>
            <h4 className="rank-title">{rank.title}</h4>
            <p className="rank-desc">{rank.desc}</p>
          </div>

          <div className="result-actions">
            <button className="quiz-restart-btn" onClick={() => startQuiz(quizMode)}>
              同じモードでもう一度受ける
            </button>
            <button className="quiz-start-screen-btn" onClick={handleGoToStart}>
              スタート画面に戻る (モード変更)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
