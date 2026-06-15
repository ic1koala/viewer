import React, { useState, useEffect, useRef } from 'react';

type CarType = 'sedan' | 'suv' | 'truck';
type SheetType = 'bead' | 'prism' | 'fullcube';

export const Simulator: React.FC = () => {
  // 状態パラメータ
  const [distance, setDistance] = useState<number>(60); // メートル (20m - 150m)
  const [carType, setCarType] = useState<CarType>('sedan');
  const [entranceAngle, setEntranceAngle] = useState<number>(5); // 度 (-45deg - 45deg)
  const [selectedSheet, setSelectedSheet] = useState<SheetType>('prism');
  const [microMode, setMicroMode] = useState<boolean>(false); // ミクロ反射原理モード

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 車タイプごとのヘッドライトからドライバーの目までの高さ (メートル)
  const eyeHeights: Record<CarType, number> = {
    sedan: 0.6,
    suv: 0.9,
    truck: 1.5,
  };

  // 物理計算
  const h = eyeHeights[carType];
  // 観測角 α (ラジアン) = arctan(高さ / 距離)
  const obsAngleRad = Math.atan(h / distance);
  const obsAngleDeg = (obsAngleRad * 180) / Math.PI;
  const obsAngleMinutes = obsAngleDeg * 60; // 分 (arcminutes)

  // 入射角 β
  const entAngleRad = (entranceAngle * Math.PI) / 180;

  // 簡易的な比反射輝度 RA の計算モデル
  // RA = RA_max * exp(-a * alpha^2) * cos(beta) * 補正
  const getRetroreflectivity = (type: SheetType, alpha: number, beta: number): number => {
    const alphaDeg = (alpha * 180) / Math.PI;
    const betaDeg = (beta * 180) / Math.PI;
    
    switch (type) {
      case 'bead': // ガラスビーズ型 (低輝度、広角)
        // ピーク輝度は低いが、観測角・入射角が大きくなっても緩やかにしか低下しない
        return Math.round(90 * Math.exp(-0.35 * Math.pow(alphaDeg, 1.8)) * Math.cos(beta) * (1 - Math.abs(betaDeg) / 90));
      case 'prism': // プリズム型 (高輝度、やや狭角)
        // ピーク輝度は高いが、観測角・入射角による減衰がやや大きい
        return Math.round(500 * Math.exp(-1.4 * Math.pow(alphaDeg, 1.5)) * Math.cos(beta * 1.2) * (1 - Math.abs(betaDeg) / 60));
      case 'fullcube': // フルキューブプリズム型 (超高輝度、超広角)
        // 非常に高いピーク輝度を持ち、広角性も改善されている (3M DG3などのモデル)
        return Math.round(900 * Math.exp(-0.8 * Math.pow(alphaDeg, 1.3)) * Math.cos(beta * 0.9) * (1 - Math.abs(betaDeg) / 80));
    }
  };

  const currentRA = getRetroreflectivity(selectedSheet, obsAngleRad, entAngleRad);

  // 視認性能判定と動的解説の定義
  const getInspectionResult = () => {
    if (obsAngleDeg > 1.2 || Math.abs(entranceAngle) >= 40) {
      return {
        status: 'ng' as const,
        advice: '❌ 視認NG：反射光が極端に減衰し、ドライバーから標識は見えません。',
        reason: obsAngleDeg > 1.2 
          ? `【原因】観測角αが広すぎます（${obsAngleDeg.toFixed(2)}°）。車が標識に近づきすぎているか、大型車（トラック）のようにアイポイント（光源と目の垂直距離）が高いためです。反射光の「光錐（光のコーン）」の中心から目が完全に外れてしまっています。`
          : `【原因】入射角βが大きすぎます（${Math.abs(entranceAngle)}°）。光の進入角度が急なため、プリズム内での全反射条件（臨界角）が崩れて光が背面に抜けているか、ガラスビーズの球面収差により裏面の反射膜へ焦点を結ばなくなっています。`
      };
    } else if (obsAngleDeg > 0.5 || Math.abs(entranceAngle) >= 20) {
      return {
        status: 'warn' as const,
        advice: '⚠️ 注意：視認性が低下しています。車載ライトからの反射が弱く見えます。',
        reason: obsAngleDeg > 0.5
          ? `【原因】観測角αがやや広がっています（${obsAngleDeg.toFixed(2)}°）。ビーズ型や通常のプリズム型シートでは輝度の減衰が目立ちます。より高輝度かつ広角性に優れたフルキューブ型（3M DG³等）への変更を検討してください。`
          : `【原因】入射角βがやや大きいです（${Math.abs(entranceAngle)}°）。標識が斜めを向いているため、反射効率が低下しています。大入射角（広角性）に特化したシート設計が求められます。`
      };
    } else {
      return {
        status: 'ok' as const,
        advice: '✨ 良好：夜間でも極めて鮮明に標識を認識できる、最適な幾何条件です。',
        reason: '【解説】観測角α（0.5°以下）および入射角β（20°未満）が十分に小さく、再帰反射の幾何光学条件（スネルの法則・全反射）が理想的に維持されています。最もエネルギーの強い反射光の中心部にドライバーの目が位置しています。'
      };
    }
  };

  const result = getInspectionResult();

  // マクロシミュレーション描画
  useEffect(() => {
    if (microMode) return; // ミクロモード時はマクロ描画をスキップ

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスのリセット
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景（夜の道路）
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(1, '#02050a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 道路の描画
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(canvas.width, 260);
    ctx.stroke();

    // 道路の破線
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(canvas.width, 280);
    ctx.stroke();
    ctx.setLineDash([]); // リセット

    // スケール変換: 20m - 150m を キャンバスの 80px - 580px にマッピング
    // 距離が短い(20m)ほど車は右側(標識に近い)、長い(150m)ほど左側(標識から遠い)になるようマッピング
    const minD = 20, maxD = 150;
    const minX = 80, maxX = 560;
    const carX = maxX - ((distance - minD) / (maxD - minD)) * (maxX - minX);
    const signX = 680; // 標識の位置 (固定)
    const signY = 140; // 標識の高さ (固定)

    // 1. 反射シート（標識）の描画
    ctx.save();
    ctx.translate(signX, signY);
    // 入射角の傾きを適用
    ctx.rotate(entAngleRad);

    // 標識の柱と枠
    ctx.restore();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    ctx.lineTo(signX, 260);
    ctx.stroke();

    ctx.save();
    ctx.translate(signX, signY);
    ctx.rotate(entAngleRad);
    
    // 標識のベース（アルミ板風）
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 反射輝度に応じた発光エフェクトの描画
    const glowIntensity = Math.min(currentRA / 1000, 1.0);
    if (glowIntensity > 0.05) {
      const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 25 + glowIntensity * 50);
      
      let glowColor = 'rgba(234, 179, 8, '; // デフォルト黄色
      if (selectedSheet === 'bead') glowColor = 'rgba(244, 63, 94, '; // ビーズは赤/ピンク系で表現
      if (selectedSheet === 'fullcube') glowColor = 'rgba(34, 197, 94, '; // フルキューブは緑系で表現

      glowGrad.addColorStop(0, glowColor + glowIntensity * 0.9 + ')');
      glowGrad.addColorStop(0.3, glowColor + glowIntensity * 0.4 + ')');
      glowGrad.addColorStop(1, glowColor + '0)');
      
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 25 + glowIntensity * 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // 反射面
    let sheetColor = '#eab308'; // 黄
    if (selectedSheet === 'bead') sheetColor = '#f43f5e'; // 赤系
    if (selectedSheet === 'fullcube') sheetColor = '#22c55e'; // 緑系
    ctx.fillStyle = sheetColor;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // 標識マーク（矢印）
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(12, 0);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-2, 0);
    ctx.closePath();
    ctx.fill();

    // 基準軸（法線）の描画
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-120, 0); // 前方へ伸ばす
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 基準軸テキスト
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillText('基準軸(法線)', -110, -8);

    ctx.restore();

    // 2. 自動車と光源・受光器の描画
    const carY = 220;
    // 車体
    ctx.fillStyle = '#334155';
    ctx.fillRect(carX - 50, carY, 60, 25);
    ctx.beginPath();
    ctx.arc(carX - 35, carY + 25, 8, 0, Math.PI * 2);
    ctx.arc(carX - 5, carY + 25, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    
    // 車キャビン
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(carX - 40, carY);
    ctx.lineTo(carX - 30, carY - 15);
    ctx.lineTo(carX - 10, carY - 15);
    ctx.lineTo(carX, carY);
    ctx.closePath();
    ctx.fill();

    // 光源（ヘッドライト）
    const lightX = carX + 10;
    const lightY = carY + 12;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(lightX, lightY, 4, 0, Math.PI * 2);
    ctx.fill();
    // 光源ハロー
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.beginPath();
    ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
    ctx.fill();

    // 受光器（ドライバーの目）
    // carType に応じてヘッドライトからの高さを変える
    // 画面上でのピクセル変換：高さ0.6m = 12px, 0.9m = 18px, 1.5m = 30px
    const eyeScale = 20; // 1m = 20px
    const eyeX = carX - 15;
    const eyeY = lightY - (h * eyeScale);
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();
    // 目標マーク風
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 7, 0, Math.PI * 2);
    ctx.stroke();

    // 3. 光線の描画
    // ヘッドライトから標識中心への「照射軸」（黄色の光線）
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    ctx.lineTo(signX, signY);
    ctx.stroke();

    // 照射軸のライトコーン（光の広がりを表現）
    ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    ctx.lineTo(signX, signY - 40);
    ctx.lineTo(signX, signY + 40);
    ctx.closePath();
    ctx.fill();

    // 標識からドライバーの目への「観測軸」（水色の光線・戻り光）
    // 反射輝度に応じて、戻り光線の不透明度（視認性）を変化させる
    const returnOpacity = Math.max(0.1, Math.min(currentRA / 600, 0.9));
    ctx.strokeStyle = `rgba(96, 165, 250, ${returnOpacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    ctx.lineTo(eyeX, eyeY);
    ctx.stroke();

    // 4. 角度の可視化
    // 照射軸と観測軸がなす「観測角 α」を強調表示
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    // 標識近くで2軸が交わる角度を描画
    const angleToLight = Math.atan2(lightY - signY, lightX - signX);
    const angleToEye = Math.atan2(eyeY - signY, eyeX - signX);
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    // 標識から長さ80pxの扇形
    ctx.arc(signX, signY, 90, angleToLight, angleToEye, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 観測角 α のテキストラベル
    const labelX = signX - 120;
    const labelY = signY + 20;
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`観測角 α: ${obsAngleDeg.toFixed(2)}° (${Math.round(obsAngleMinutes)}′)`, labelX, labelY);
    
    // 入射角 β の描画（基準軸と照射軸の間の角度）
    // 標識から前方方向に向かう基準軸の角度は entAngleRad + Math.PI (180度反転)
    const normAngle = entAngleRad + Math.PI;
    const lightAngleFromSign = Math.atan2(lightY - signY, lightX - signX);
    
    ctx.strokeStyle = '#f87171';
    ctx.fillStyle = 'rgba(248, 113, 113, 0.15)';
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    ctx.arc(signX, signY, 60, Math.min(normAngle, lightAngleFromSign), Math.max(normAngle, lightAngleFromSign));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 入射角 β のテキストラベル
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`入射角 β: ${Math.abs(entranceAngle)}°`, signX - 80, signY - 45);

    // 情報オーバーレイ
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Outfit, sans-serif';
    ctx.fillText(`測定距離: ${distance} m`, 20, 30);
    ctx.fillText(`アイポイント高さ(h): ${h} m (${carType.toUpperCase()})`, 20, 50);

  }, [distance, carType, entranceAngle, selectedSheet, microMode, currentRA, obsAngleDeg, obsAngleMinutes, entAngleRad, h]);

  // ミクロ反射原理（拡大アニメーション図）の描画
  useEffect(() => {
    if (!microMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (selectedSheet === 'bead') {
      // --- ガラスビーズ型のミクロ原理描画 ---
      // タイトル
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText('ガラスビーズ型 再帰反射メカニズム (断面拡大)', 20, 40);

      // ガラスビーズ球体
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const r = 100;

      // 樹脂基材層と反射層（背面）
      ctx.strokeStyle = '#e2e8f0';
      ctx.fillStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // ビーズの背面にフィットする半球面反射膜
      ctx.arc(cx, cy, r + 4, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();

      // 反射層（アルミニウム蒸着）
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, -Math.PI/2, Math.PI/2, false);
      ctx.arc(cx, cy, r + 16, Math.PI/2, -Math.PI/2, true);
      ctx.closePath();
      ctx.fill();

      // ガラスビーズ本体（円）
      const glassGrad = ctx.createRadialGradient(cx - r/3, cy - r/3, 10, cx, cy, r);
      glassGrad.addColorStop(0, '#e0f2fe');
      glassGrad.addColorStop(0.8, '#bae6fd');
      glassGrad.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = glassGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 光線のシミュレーション (Snellの法則による屈折)
      // 入射光
      const incomingY = cy - 50;
      const startX = cx - 300;
      
      // ガラスへの入射点
      // 球面方程式 (x-cx)^2 + (y-cy)^2 = r^2 より、左側半球のx座標
      // x = cx - sqrt(r^2 - (y-cy)^2)
      const dy = incomingY - cy;
      const intersectX = cx - Math.sqrt(r * r - dy * dy);

      ctx.strokeStyle = '#eab308'; // 黄色光線
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX, incomingY);
      ctx.lineTo(intersectX, incomingY);
      ctx.stroke();

      // 屈折光（ビーズ内）
      // 理想屈折率 n=2.0 のとき、平行光線はちょうど裏面の極点 (cx + r, cy) で集光する
      const focusX = cx + r;
      const focusY = cy; // 中心軸上（近軸）であれば

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.beginPath();
      ctx.moveTo(intersectX, incomingY);
      ctx.lineTo(focusX, focusY);
      ctx.stroke();

      // 反射＆ビーズから出ていく光（再帰反射）
      // 反射して再びビーズ表面の対称位置へ
      // 出射点
      const exitX = intersectX;
      const exitY = cy + (cy - incomingY); // 対称軸

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.beginPath();
      ctx.moveTo(focusX, focusY);
      ctx.lineTo(exitX, exitY);
      ctx.stroke();

      // 空気中への出射光 (元の平行光線と同じ角度で戻る)
      ctx.strokeStyle = '#60a5fa'; // 戻り光は青で分かりやすく
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(startX, exitY);
      ctx.stroke();

      // ラベルと矢印
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Outfit, sans-serif';
      ctx.fillText('入射光 (ヘッドライト)', startX + 10, incomingY - 10);
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('再帰反射光 (ドライバーの目へ)', startX + 10, exitY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('焦点位置の金属反射膜(アルミ等)', focusX + 20, focusY);
      ctx.fillText('屈折率 n ≈ 1.9〜2.2', cx - 50, cy + 130);

    } else {
      // --- プリズム型（コーナーキューブ）のミクロ原理描画 ---
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText('コーナーキューブ（プリズム）型 再帰反射メカニズム', 20, 40);

      // 直交三面反射の2D簡易断面モデル（鋸歯状のプリズム素子）
      const startX = 100;
      const startY = 150;
      const step = 100; // プリズムの幅
      const count = 5;

      // プリズム背面構造 (V字の配列)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 0; i < count; i++) {
        const px = startX + i * step;
        ctx.lineTo(px + step/2, startY + step * 0.8); // 頂点
        ctx.lineTo(px + step, startY); // 底面
      }
      ctx.stroke();
      ctx.lineTo(startX + count * step, startY - 50);
      ctx.lineTo(startX, startY - 50);
      ctx.closePath();
      ctx.fill();

      // フロント表面フィルム面 (平滑な面)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX + count * step, startY - 30);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(startX, startY - 30, count * step, 30);

      // 光線経路（コーナーキューブ内での反射）
      // 中央の1つのV字谷に着目して光線を描く
      const pIdx = 2; // 中央のプリズム
      const px = startX + pIdx * step;
      
      const rayInX = px + step * 0.2;
      const rayInY = startY - 100;
      const entryPointX = rayInX;
      const entryPointY = startY - 30; // 表面での屈折

      // 第1反射面 (左斜面) への到達
      // 左斜面の式: y - startY = 1.6 * (x - px)
      // 光線の式: x = entryPointX (垂直入射の場合)
      // 交点
      const reflect1X = entryPointX;
      const reflect1Y = startY + 1.6 * (reflect1X - px);

      // 第2反射面 (右斜面) への反射
      // 90度直交反射のため、x軸方向に進む
      // 右斜面の式: y - startY = -1.6 * (x - (px + step))
      // 反射光: y = reflect1Y
      // 交点 x: reflect1Y - startY = -1.6 * (x - px - step) => (reflect1Y - startY)/-1.6 + px + step
      const reflect2X = (reflect1Y - startY) / -1.6 + px + step;
      const reflect2Y = reflect1Y;

      // 出射光 (入射方向と完全に並行に戻る)
      const exitPointX = reflect2X;
      const exitPointY = startY - 30;

      // 1. 入射光
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rayInX, rayInY);
      ctx.lineTo(entryPointX, entryPointY);
      ctx.stroke();

      // 2. 内部光 (屈折含む)
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(entryPointX, entryPointY);
      ctx.lineTo(reflect1X, reflect1Y);
      ctx.lineTo(reflect2X, reflect2Y);
      ctx.lineTo(exitPointX, exitPointY);
      ctx.stroke();

      // 3. 反射光
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(exitPointX, exitPointY);
      ctx.lineTo(exitPointX, rayInY);
      ctx.stroke();

      // 空気（空気層）ラベル
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Outfit, sans-serif';
      ctx.fillText('空気層 (全反射のために必須)', px + 10, startY + step + 15);
      ctx.fillText('プリズム素材 (アクリル等)', px - 80, startY - 10);
      ctx.fillText('表面フラットフィルム', px - 80, startY - 40);

      // 光の方向矢印
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Outfit, sans-serif';
      ctx.fillText('入射光', rayInX - 25, rayInY - 10);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('再帰反射光', exitPointX - 35, rayInY - 10);

      // 解説
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px Outfit, sans-serif';
      ctx.fillText('直交する鏡面での全反射 (Total Internal Reflection) を利用するため、', 50, canvas.height - 50);
      ctx.fillText('ガラスビーズ型のような金属反射膜が不要で、ほぼ100%に近い反射効率を得られます。', 50, canvas.height - 30);
    }

  }, [microMode, selectedSheet]);

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <h2 className="section-title">再帰反射インタラクティブシミュレーター</h2>
        <p className="section-subtitle">
          光源（車）の距離や高さ、反射シートの傾きによって、反射光がドライバーにどう届くかをリアルタイムにシミュレートします。
        </p>
      </div>

      <div className="simulator-workspace">
        {/* シミュレーション表示 */}
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={720}
            height={300}
            className="simulator-canvas"
          />
          <div className="view-toggle">
            <button
              className={`toggle-btn ${!microMode ? 'active' : ''}`}
              onClick={() => setMicroMode(false)}
            >
              マクロ視点 (道路・測定幾何学)
            </button>
            <button
              className={`toggle-btn ${microMode ? 'active' : ''}`}
              onClick={() => setMicroMode(true)}
            >
              ミクロ視点 (素子内部反射)
            </button>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className="control-panel">
          <h3 className="panel-title">シミュレーション・パラメータ</h3>
          
          {/* 反射材の選択 */}
          <div className="control-group">
            <label className="control-label">反射シートの種類</label>
            <div className="sheet-select-grid">
              <button
                className={`sheet-btn ${selectedSheet === 'bead' ? 'active-bead' : ''}`}
                onClick={() => setSelectedSheet('bead')}
              >
                <span className="dot bead-dot"></span>
                ガラスビーズ型 (一般反射)
              </button>
              <button
                className={`sheet-btn ${selectedSheet === 'prism' ? 'active-prism' : ''}`}
                onClick={() => setSelectedSheet('prism')}
              >
                <span className="dot prism-dot"></span>
                プリズム型 (高輝度)
              </button>
              <button
                className={`sheet-btn ${selectedSheet === 'fullcube' ? 'active-full' : ''}`}
                onClick={() => setSelectedSheet('fullcube')}
              >
                <span className="dot full-dot"></span>
                フルキューブ型 (超高輝度)
              </button>
            </div>
          </div>

          {!microMode ? (
            <>
              {/* 車種（目線の高さ）の選択 */}
              <div className="control-group">
                <label className="control-label">車両タイプ (アイポイント差)</label>
                <div className="car-select-grid">
                  <button
                    className={`car-btn ${carType === 'sedan' ? 'active' : ''}`}
                    onClick={() => setCarType('sedan')}
                  >
                    乗用車/セダン (h = 0.6m)
                  </button>
                  <button
                    className={`car-btn ${carType === 'suv' ? 'active' : ''}`}
                    onClick={() => setCarType('suv')}
                  >
                    SUV (h = 0.9m)
                  </button>
                  <button
                    className={`car-btn ${carType === 'truck' ? 'active' : ''}`}
                    onClick={() => setCarType('truck')}
                  >
                    大型トラック (h = 1.5m)
                  </button>
                </div>
              </div>

              {/* 測定距離スライダー */}
              <div className="control-group">
                <div className="slider-header">
                  <span className="control-label">測定距離 (d)</span>
                  <span className="value-display">{distance} m</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-range">
                  <span>20m (近距離)</span>
                  <span>150m (遠距離)</span>
                </div>
              </div>

              {/* 入射角スライダー */}
              <div className="control-group">
                <div className="slider-header">
                  <span className="control-label">入射角 (β - シートの傾き)</span>
                  <span className="value-display">{entranceAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={entranceAngle}
                  onChange={(e) => setEntranceAngle(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-range">
                  <span>-45°</span>
                  <span>0° (正面)</span>
                  <span>45°</span>
                </div>
              </div>
            </>
          ) : (
            <div className="micro-info-box">
              <h4>{selectedSheet === 'bead' ? 'ガラスビーズ方式の光学原理' : 'プリズム（コーナーキューブ）方式の光学原理'}</h4>
              {selectedSheet === 'bead' ? (
                <p>
                  球形ビーズの「屈折」と裏面の「金属反射膜」を組み合わせて光を戻します。
                  スネルの法則に基づき、空気中ではビーズの屈折率 $n \approx 2.0$ のときに光軸上で完全に焦点を結びます。
                  三次元的な方向性（広角性）に優れますが、ガラス面での屈折損失や透過漏れがあるため、絶対的な反射性能（輝度）はプリズム型に劣ります。
                </p>
              ) : (
                <p>
                  三面が互いに直角に交わる「コーナーキューブプリズム」による3回連続の「全反射（TIR）」を利用します。
                  入射ベクトル u に対して、それぞれの面での反射により各軸成分が反転し、最終的に -u 方向（光源方向）へ光を完全に平行に戻します。
                  金属反射層を必要とせず、樹脂と空気層の境界における100%全反射を利用するため、ビーズ式に比べて圧倒的に高い比反射輝度係数 (RA) を実現できます。
                </p>
              )}
            </div>
          )}

          {/* 測定結果表示 */}
          <div className="results-display">
            <div className="result-metric">
              <span className="metric-label">算出された観測角 (α)</span>
              <span className="metric-value blue-text">
                {obsAngleDeg.toFixed(2)}° ({Math.round(obsAngleMinutes)}′)
              </span>
            </div>
            <div className="result-metric">
              <span className="metric-label">推定比反射輝度係数 (RA)</span>
              <span className="metric-value gold-text">
                {currentRA} <span className="unit">cd/lx/m²</span>
              </span>
            </div>
            
            {/* 簡易警告・アドバイス */}
            <div className="result-advice">
              <span className={`${result.status}-badge`}>{result.advice}</span>
              <p className="result-reason-text">{result.reason}</p>
            </div>
          </div>

          {/* 新設：判定基準ガイド */}
          <div className="advice-guide-box">
            <h4>💡 視認判定の基準値とNG範囲</h4>
            <p className="guide-intro">
              再帰反射シートは入射光を光源へ「コーン状（光錐）」に戻すため、以下の角度が大きくなると反射光は急激に弱まります。
            </p>
            <ul className="guide-list">
              <li>
                <strong>観測角 (α) [ライトと目の高低差]</strong>:
                <ul>
                  <li><code>0.2° 〜 0.33° (12′〜20′)</code>: <strong>最適（最高輝度）</strong>。遠方走行時。</li>
                  <li><code>0.5° (30′) 超</code>: <strong>注意</strong>。大型車や近距離で発生し、輝度が大幅に減衰。</li>
                  <li><code>1.2° (72′) 超</code>: <strong>NG（視認不可）</strong>。光錐から目が完全に外れ、標識が暗黒化。</li>
                </ul>
              </li>
              <li>
                <strong>入射角 (β) [光の差し込む傾き]</strong>:
                <ul>
                  <li><code>0° 〜 15°</code>: <strong>良好</strong>。正面に近い反射。</li>
                  <li><code>20° 〜 35°</code>: <strong>注意</strong>。カーブ等の斜め受光。広角性シートが必要。</li>
                  <li><code>40° 以上</code>: <strong>NG（全反射の喪失）</strong>。アクリル臨界角を超えて光が透過漏れし反射不能。</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
