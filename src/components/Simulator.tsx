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

  // 比反射輝度 RA の計算モデル
  // ASTM D4956 公式最低値に準拠してキャリブレーション済み
  // 参考基準: Type I (70), Type IV (360), Type XI (580) cd/lx/m² @α=0.2°, β=-4°
  const getRetroreflectivity = (type: SheetType, alpha: number, beta: number): number => {
    const alphaDeg = (alpha * 180) / Math.PI;
    const betaDeg = (beta * 180) / Math.PI;
    
    switch (type) {
      case 'bead': // ガラスビーズ型 (ASTM Type I 相当, 封入レンズ方式)
        // 基準RA₀≈105, 減衰: exp(-3.0·α^1.6), β限界: ±50°
        // 検証: α=0.2°/β=5°→~70, α=0.5°/β=5°→~34, α=1.0°/β=5°→~5
        return Math.max(0, Math.round(
          105 * Math.exp(-3.0 * Math.pow(alphaDeg, 1.6))
          * Math.cos(beta)
          * Math.max(0, 1 - Math.abs(betaDeg) / 50)
        ));
      case 'prism': // プリズム型 (ASTM Type IV 相当, マイクロプリズム方式)
        // 基準RA₀≈470, 減衰: exp(-3.2·α^1.85), β限界: ±55°
        // 検証: α=0.2°/β=5°→~363, α=0.5°/β=5°→~166, α=1.0°/β=5°→~17
        return Math.max(0, Math.round(
          470 * Math.exp(-3.2 * Math.pow(alphaDeg, 1.85))
          * Math.cos(beta)
          * Math.max(0, 1 - Math.abs(betaDeg) / 55)
        ));
      case 'fullcube': // フルキューブプリズム型 (ASTM Type XI 相当, 3M DG³等)
        // 基準RA₀≈670, 減衰: exp(-1.64·α²), β限界: ±70°
        // 検証: α=0.2°/β=5°→~580, α=0.5°/β=5°→~411, α=1.0°/β=5°→~120
        return Math.max(0, Math.round(
          670 * Math.exp(-1.64 * Math.pow(alphaDeg, 2.0))
          * Math.cos(beta)
          * Math.max(0, 1 - Math.abs(betaDeg) / 70)
        ));
    }
  };

  const currentRA = getRetroreflectivity(selectedSheet, obsAngleRad, entAngleRad);

  // 視認性能判定と動的解説の定義
  const getInspectionResult = () => {
    const isObsNg = obsAngleDeg > 1.2;
    const isEntNg = Math.abs(entranceAngle) >= 40;
    const isObsWarn = obsAngleDeg > 0.5 && obsAngleDeg <= 1.2;
    const isEntWarn = Math.abs(entranceAngle) >= 20 && Math.abs(entranceAngle) < 40;

    if (isObsNg || isEntNg) {
      return {
        status: 'ng' as const,
        advice: '❌ 視認NG：反射光がドライバーに届かず、標識は完全に暗黒化します。',
        reason: isObsNg 
          ? `【観測角NG】観測角αが広すぎます（現在 ${obsAngleDeg.toFixed(2)}° ＞ 限界 1.20°）。車が標識に近づきすぎているか、アイポイント（ライトと目の垂直差）が高いためです。反射光の「光錐（光のコーン）」の中心からドライバーの目が完全に外れてしまっています。`
          : `【入射角NG】入射角βが大きすぎます（現在 ${Math.abs(entranceAngle)}° ＞ 限界 40°）。光の進入角度が急すぎるため、プリズム背面での全反射条件（臨界角）が崩れて光が透過漏れしているか、ビーズの球面収差により裏面の反射膜へ焦点を結ばなくなっています。`
      };
    } else if (isObsWarn || isEntWarn) {
      return {
        status: 'warn' as const,
        advice: '⚠️ 注意：視認性が大幅に低下しています。反射光が弱くボヤけて見えます。',
        reason: isObsWarn
          ? `【観測角警告】観測角αがやや広がっています（現在 ${obsAngleDeg.toFixed(2)}°）。ガラスビーズ型や通常プリズム型では輝度が大幅に低下します。広角性に優れるフルキューブ型（3M DG³等）を使用すれば視認性をある程度カバー可能です。`
          : `【入射角警告】入射角βがやや大きいです（現在 ${Math.abs(entranceAngle)}°）。標識が傾いて設置されているか、急カーブ手前での受光のため、反射効率が低下しています。広角性に配慮したシート設計が必要です。`
      };
    } else {
      return {
        status: 'ok' as const,
        advice: '✨ 良好：夜間でも極めて鮮明に標識を認識できる、最適な幾何条件です。',
        reason: '【解説】観測角α（0.50°以下）および入射角β（20°未満）が十分に小さく、再帰反射の幾何光学条件が理想的に維持されています。最もエネルギーの強い中心反射光の真ん中にドライバーの目が位置しています。'
      };
    }
  };

  const result = getInspectionResult();

  // 各車種におけるNGとなる危険距離の算出（観測角 α > 1.2° になる距離）
  const getDangerZoneLimit = (type: CarType): number => {
    // tan(1.2 deg) = h / distance => distance = h / tan(1.2 deg)
    const limitRad = (1.2 * Math.PI) / 180;
    return Math.round(eyeHeights[type] / Math.tan(limitRad));
  };

  // マクロシミュレーション描画
  useEffect(() => {
    if (microMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // スケール変換: 20m - 150m を キャンバスの 220px - 640px にマッピング
    // 距離が短い(20m)ほど車は左側(標識に近い)、長い(150m)ほど右側(標識から遠い)になるようマッピング
    const minD = 20, maxD = 150;
    const minX = 220, maxX = 640;
    const carX = minX + ((distance - minD) / (maxD - minD)) * (maxX - minX);
    
    // 標識の位置 (左側に配置)
    const signX = 80;
    const signY = 140;

    // 1. 反射シート（標識）の描画
    ctx.save();
    ctx.translate(signX, signY);
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
    
    // 標識のベース
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 反射輝度に応じた発光エフェクトの描画
    const glowIntensity = result.status === 'ng' ? 0 : Math.min(currentRA / 1000, 1.0);
    if (glowIntensity > 0.05) {
      const glowGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 25 + glowIntensity * 50);
      
      let glowColor = 'rgba(234, 179, 8, '; // デフォルト黄色
      if (selectedSheet === 'bead') glowColor = 'rgba(244, 63, 94, '; // ビーズは赤/ピンク系
      if (selectedSheet === 'fullcube') glowColor = 'rgba(34, 197, 94, '; // フルキューブは緑系

      glowGrad.addColorStop(0, glowColor + glowIntensity * 0.9 + ')');
      glowGrad.addColorStop(0.3, glowColor + glowIntensity * 0.4 + ')');
      glowGrad.addColorStop(1, glowColor + '0)');
      
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 25 + glowIntensity * 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // 反射面の色決定
    let sheetColor = '#eab308'; // 黄
    if (selectedSheet === 'bead') sheetColor = '#f43f5e'; // 赤系
    if (selectedSheet === 'fullcube') sheetColor = '#22c55e'; // 緑系
    ctx.fillStyle = sheetColor;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // 標識マーク（左折の矢印、車が走ってくる側に向ける）
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(-12, 0);
    ctx.lineTo(8, 12);
    ctx.lineTo(2, 0);
    ctx.closePath();
    ctx.fill();

    // 基準軸（法線）の描画（右の車両方向へ伸ばす）
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(120, 0); 
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 基準軸テキスト
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillText('基準軸(法線)', 10, -8);

    ctx.restore();

    // 2. 自動車と光源・受光器の描画（左向き）
    const carY = 220;
    // 車体
    ctx.fillStyle = '#334155';
    ctx.fillRect(carX, carY, 60, 25); // carX が車の先頭（左端）
    
    // タイヤ
    ctx.beginPath();
    ctx.arc(carX + 15, carY + 25, 8, 0, Math.PI * 2);
    ctx.arc(carX + 45, carY + 25, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    
    // 車キャビン（左向き）
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(carX + 10, carY);
    ctx.lineTo(carX + 20, carY - 15);
    ctx.lineTo(carX + 45, carY - 15);
    ctx.lineTo(carX + 55, carY);
    ctx.closePath();
    ctx.fill();

    // 光源（ヘッドライト - 左端）
    const lightX = carX;
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

    // 受光器（ドライバーの目 - キャビンの左側寄りの席）
    const eyeScale = 20; // 1m = 20px
    const eyeX = carX + 22; // ヘッドライトより少し後方
    const eyeY = lightY - (h * eyeScale);
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();
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

    // 照射軸のライトコーン
    ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    ctx.lineTo(signX, signY - 40);
    ctx.lineTo(signX, signY + 40);
    ctx.closePath();
    ctx.fill();

    // 標識からドライバーの目への「観測軸」（水色の光線・戻り光）
    const returnOpacity = Math.max(0.1, Math.min(currentRA / 600, 0.9));
    
    if (result.status === 'ng') {
      // NG時は戻り光線が届かない（極薄の赤点線）
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(signX, signY);
      ctx.lineTo(eyeX, eyeY);
      ctx.stroke();
      ctx.setLineDash([]); // リセット
    } else {
      ctx.strokeStyle = `rgba(96, 165, 250, ${returnOpacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(signX, signY);
      ctx.lineTo(eyeX, eyeY);
      ctx.stroke();
    }

    // 4. 角度の可視化
    // 観測角 α
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    const angleToLight = Math.atan2(lightY - signY, lightX - signX);
    const angleToEye = Math.atan2(eyeY - signY, eyeX - signX);
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    ctx.arc(signX, signY, 90, angleToLight, angleToEye, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 観測角 α のテキストラベル (車と重ならないよう右上に配置)
    const labelX = signX + 110;
    const labelY = signY + 25;
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`観測角 α: ${obsAngleDeg.toFixed(2)}° (${Math.round(obsAngleMinutes)}′)`, labelX, labelY);
    
    // 入射角 β の描画（基準軸と照射軸の間の角度）
    // 基準軸は entAngleRad。照射軸は lightAngleFromSign
    const lightAngleFromSign = Math.atan2(lightY - signY, lightX - signX);
    
    ctx.strokeStyle = '#f87171';
    ctx.fillStyle = 'rgba(248, 113, 113, 0.15)';
    ctx.beginPath();
    ctx.moveTo(signX, signY);
    ctx.arc(signX, signY, 60, Math.min(entAngleRad, lightAngleFromSign), Math.max(entAngleRad, lightAngleFromSign));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 入射角 β のテキストラベル
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`入射角 β: ${Math.abs(entranceAngle)}°`, signX + 70, signY - 45);

    // 情報オーバーレイ
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Outfit, sans-serif';
    ctx.fillText(`測定距離: ${distance} m`, 20, 30);
    ctx.fillText(`アイポイント高さ(h): ${h} m (${carType.toUpperCase()})`, 20, 50);

  }, [distance, carType, entranceAngle, selectedSheet, microMode, currentRA, obsAngleDeg, obsAngleMinutes, entAngleRad, h, result.status]);

  // ミクロ反射原理の描画
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
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText('ガラスビーズ型 再帰反射メカニズム (断面拡大)', 20, 40);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const r = 100;

      ctx.strokeStyle = '#e2e8f0';
      ctx.fillStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, -Math.PI/2, Math.PI/2, false);
      ctx.arc(cx, cy, r + 16, Math.PI/2, -Math.PI/2, true);
      ctx.closePath();
      ctx.fill();

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

      const incomingY = cy - 50;
      const startX = cx - 300;
      
      const dy = incomingY - cy;
      const intersectX = cx - Math.sqrt(r * r - dy * dy);

      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX, incomingY);
      ctx.lineTo(intersectX, incomingY);
      ctx.stroke();

      const focusX = cx + r;
      const focusY = cy;

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.beginPath();
      ctx.moveTo(intersectX, incomingY);
      ctx.lineTo(focusX, focusY);
      ctx.stroke();

      const exitX = intersectX;
      const exitY = cy + (cy - incomingY);

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.beginPath();
      ctx.moveTo(focusX, focusY);
      ctx.lineTo(exitX, exitY);
      ctx.stroke();

      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(startX, exitY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Outfit, sans-serif';
      ctx.fillText('入射光 (ヘッドライト)', startX + 10, incomingY - 10);
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('再帰反射光 (ドライバーの目へ)', startX + 10, exitY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('焦点位置の金属反射膜(アルミ等)', focusX + 20, focusY);
      ctx.fillText('屈折率 n ≈ 1.9〜2.2', cx - 50, cy + 130);

    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText('コーナーキューブ（プリズム）型 再帰反射メカニズム', 20, 40);

      const startX = 100;
      const startY = 150;
      const step = 100;
      const count = 5;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 0; i < count; i++) {
        const px = startX + i * step;
        ctx.lineTo(px + step/2, startY + step * 0.8);
        ctx.lineTo(px + step, startY);
      }
      ctx.stroke();
      ctx.lineTo(startX + count * step, startY - 50);
      ctx.lineTo(startX, startY - 50);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX + count * step, startY - 30);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(startX, startY - 30, count * step, 30);

      const pIdx = 2;
      const px = startX + pIdx * step;
      
      const rayInX = px + step * 0.2;
      const rayInY = startY - 100;
      const entryPointX = rayInX;
      const entryPointY = startY - 30;

      const reflect1X = entryPointX;
      const reflect1Y = startY + 1.6 * (reflect1X - px);

      const reflect2X = (reflect1Y - startY) / -1.6 + px + step;
      const reflect2Y = reflect1Y;

      const exitPointX = reflect2X;
      const exitPointY = startY - 30;

      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rayInX, rayInY);
      ctx.lineTo(entryPointX, entryPointY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(entryPointX, entryPointY);
      ctx.lineTo(reflect1X, reflect1Y);
      ctx.lineTo(reflect2X, reflect2Y);
      ctx.lineTo(exitPointX, exitPointY);
      ctx.stroke();

      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(exitPointX, exitPointY);
      ctx.lineTo(exitPointX, rayInY);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Outfit, sans-serif';
      ctx.fillText('空気層 (全反射のために必須)', px + 10, startY + step + 15);
      ctx.fillText('プリズム素材 (アクリル等)', px - 80, startY - 10);
      ctx.fillText('表面フラットフィルム', px - 80, startY - 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Outfit, sans-serif';
      ctx.fillText('入射光', rayInX - 25, rayInY - 10);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('再帰反射光', exitPointX - 35, rayInY - 10);

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
                  <span>20m (近距離・左側)</span>
                  <span>150m (遠距離・右側)</span>
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

          {/* 測定結果表示と動的アラート */}
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
            <div className="result-metric astm-ref">
              <span className="metric-label">ASTM D4956 基準最低値 (α=0.2°, β=-4°)</span>
              <span className="metric-value" style={{fontSize: '0.8em', opacity: 0.7}}>
                {selectedSheet === 'bead' ? 'Type I: 70' : selectedSheet === 'prism' ? 'Type IV: 360' : 'Type XI: 580'} cd/lx/m²
              </span>
            </div>
            
            {/* 視認判定アラート */}
            <div className={`result-advice-card result-${result.status}`}>
              <div className="advice-badge">{result.advice}</div>
              <p className="result-reason-text">{result.reason}</p>
            </div>
          </div>

        </div>
      </div>

      {/* リアルタイム視認境界チェックシート */}
      <div className="realtime-check-sheet">
        <h4>📊 リアルタイム視認基準チェック</h4>
        <div className="check-grid">
          <div className={`check-item ${obsAngleDeg > 1.2 ? 'check-failed' : obsAngleDeg > 0.5 ? 'check-warning' : 'check-success'}`}>
            <span className="check-icon">
              {obsAngleDeg > 1.2 ? '❌' : obsAngleDeg > 0.5 ? '⚠️' : '✅'}
            </span>
            <div className="check-details">
              <h5>観測角制限 (α ≦ 1.20°)</h5>
              <p>現在: <strong>{obsAngleDeg.toFixed(2)}°</strong> (限界 1.20° / 警告 0.50°)</p>
            </div>
          </div>
          <div className={`check-item ${Math.abs(entranceAngle) >= 40 ? 'check-failed' : Math.abs(entranceAngle) >= 20 ? 'check-warning' : 'check-success'}`}>
            <span className="check-icon">
              {Math.abs(entranceAngle) >= 40 ? '❌' : Math.abs(entranceAngle) >= 20 ? '⚠️' : '✅'}
            </span>
            <div className="check-details">
              <h5>入射角制限 (β ≦ 40.0°)</h5>
              <p>現在: <strong>{Math.abs(entranceAngle)}.0°</strong> (限界 40.0° / 警告 20.0°)</p>
            </div>
          </div>
        </div>

        <div className="danger-zones-box">
          <h5>🚨 危険（視認NG）になる条件範囲</h5>
          <div className="danger-limits-table-wrapper">
            <table className="danger-limits-table">
              <thead>
                <tr>
                  <th>車両タイプ</th>
                  <th>アイポイント差 (h)</th>
                  <th>危険（視認NG）になる範囲</th>
                </tr>
              </thead>
              <tbody>
                <tr className={carType === 'sedan' ? 'highlight-danger-row' : ''}>
                  <td>乗用車/セダン</td>
                  <td>0.6 m</td>
                  <td>測定距離 <strong>{getDangerZoneLimit('sedan')}m 以下</strong> (α ＞ 1.2°)</td>
                </tr>
                <tr className={carType === 'suv' ? 'highlight-danger-row' : ''}>
                  <td>SUV</td>
                  <td>0.9 m</td>
                  <td>測定距離 <strong>{getDangerZoneLimit('suv')}m 以下</strong> (α ＞ 1.2°)</td>
                </tr>
                <tr className={carType === 'truck' ? 'highlight-danger-row' : ''}>
                  <td>大型トラック</td>
                  <td>1.5 m</td>
                  <td>測定距離 <strong>{getDangerZoneLimit('truck')}m 以下</strong> (α ＞ 1.2°)</td>
                </tr>
                <tr className={Math.abs(entranceAngle) >= 40 ? 'highlight-danger-row' : ''}>
                  <td>すべての車種</td>
                  <td>-</td>
                  <td>入射角(β - シートの傾き) <strong>40° 以上</strong> (左右)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="danger-note">
            ※ 距離が近づくほど、ライトと運転手の目の高低差による角度（観測角α）は<strong>広がります</strong>。
            そのため、<strong>「近距離＝明るくて見えやすい」は間違い</strong>で、近すぎると再帰反射の有効光から目が外れて標識が消灯したように暗く見えなくなります（これがNGのメカニズムです）。
          </p>
        </div>
      </div>

    </div>
  );
};
