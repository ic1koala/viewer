import React, { useState } from 'react';
import { quizQuestions, type Question } from '../data/quiz';

export const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQuestion: Question = quizQuestions[currentIdx];

  const handleOptionClick = (optionIdx: number) => {
    if (isSubmitted) return; // 回答提出済みの場合は何もしない
    setSelectedAnswer(optionIdx);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isSubmitted) return;
    
    setIsSubmitted(true);
    if (selectedAnswer === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // スコアに基づく評価ランク判定
  const getRankInfo = (finalScore: number) => {
    const ratio = finalScore / quizQuestions.length;
    if (ratio === 1.0) {
      return {
        title: "再帰反射マスター (輝度100%!)",
        desc: "おめでとうございます！すべての専門的な問題を完璧に正解しました。エンジニアや研究者レベルの素晴らしい知識を持っています。",
        colorClass: "rank-master"
      };
    } else if (ratio >= 0.6) {
      return {
        title: "プリズム級エンジニア",
        desc: "優秀な成績です！再帰反射シートの主要技術や物理理論、メーカーごとの強みをしっかりと理解できています。",
        colorClass: "rank-expert"
      };
    } else {
      return {
        title: "ガラスビーズ級（基礎習得中）",
        desc: "基礎的な知識は身についていますが、プリズムや各メーカーの特許情報、測定角度などについてもう少し学習を深めてみましょう。",
        colorClass: "rank-novice"
      };
    }
  };

  const rank = getRankInfo(score);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="section-title">再帰反射知識 理解度テスト</h2>
        <p className="section-subtitle">
          再帰反射の物理原理、測定方法、主要メーカーのコア特許に関するクイズに挑戦し、あなたの知識レベルを測定します。
        </p>
      </div>

      {!quizFinished ? (
        <div className="quiz-card">
          {/* プログレスバー */}
          <div className="quiz-progress-bar-wrapper">
            <div className="progress-text">
              問題 <strong>{currentIdx + 1}</strong> / {quizQuestions.length}
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
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
                    <span className="result-incorrect-label">❌ 不正解...</span>
                  )}
                </div>
                <h4 className="explanation-title">解説:</h4>
                <p className="explanation-body">{currentQuestion.explanation}</p>
                <button className="quiz-next-btn" onClick={handleNext}>
                  {currentIdx + 1 < quizQuestions.length ? '次の問題へ' : 'テストを終了して結果を見る'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // テスト完了結果画面
        <div className="quiz-result-card animated scaleIn">
          <h3 className="result-title">理解度テスト 結果発表</h3>
          
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <span className="score-num">{score}</span>
              <span className="score-total">/ {quizQuestions.length}</span>
            </div>
            <p className="score-subtext">正解数</p>
          </div>

          <div className={`rank-card ${rank.colorClass}`}>
            <h4 className="rank-title">{rank.title}</h4>
            <p className="rank-desc">{rank.desc}</p>
          </div>

          <button className="quiz-restart-btn" onClick={handleRestart}>
            もう一度テストに挑戦する
          </button>
        </div>
      )}
    </div>
  );
};
