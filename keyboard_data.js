// 한글 키보드 레이아웃 및 가중치 데이터
const keyboardData = {
  layout: [
    // 첫 번째 행
    [
      { char: 'ㅂ', weight: 0.07, row: 0, col: 0 },
      { char: 'ㅈ', weight: 0.09, row: 0, col: 1 },
      { char: 'ㄷ', weight: 0.09, row: 0, col: 2 },
      { char: 'ㄱ', weight: 0.17, row: 0, col: 3 },
      { char: 'ㅅ', weight: 0.13, row: 0, col: 4 },
      { char: 'ㅛ', weight: 0.02, row: 0, col: 5 },
      { char: 'ㅕ', weight: 0.04, row: 0, col: 6 },
      { char: 'ㅑ', weight: 0.01, row: 0, col: 7 },
      { char: 'ㅐ', weight: 0.05, row: 0, col: 8 },
      { char: 'ㅔ', weight: 0.06, row: 0, col: 9 }
    ],
    // 두 번째 행
    [
      { char: 'ㅁ', weight: 0.09, row: 1, col: 0 },
      { char: 'ㄴ', weight: 0.22, row: 1, col: 1 },
      { char: 'ㅇ', weight: 0.24, row: 1, col: 2 },
      { char: 'ㄹ', weight: 0.14, row: 1, col: 3 },
      { char: 'ㅎ', weight: 0.07, row: 1, col: 4 },
      { char: 'ㅗ', weight: 0.13, row: 1, col: 5 },
      { char: 'ㅓ', weight: 0.11, row: 1, col: 6 },
      { char: 'ㅏ', weight: 0.24, row: 1, col: 7 },
      { char: 'ㅣ', weight: 0.19, row: 1, col: 8 },
      { char: ';', weight: 0.00, row: 1, col: 9 }
    ],
    // 세 번째 행
    [
      { char: 'ㅋ', weight: 0.02, row: 2, col: 0 },
      { char: 'ㅌ', weight: 0.03, row: 2, col: 1 },
      { char: 'ㅊ', weight: 0.02, row: 2, col: 2 },
      { char: 'ㅍ', weight: 0.02, row: 2, col: 3 },
      { char: 'ㅠ', weight: 0.01, row: 2, col: 4 },
      { char: 'ㅜ', weight: 0.08, row: 2, col: 5 },
      { char: 'ㅡ', weight: 0.12, row: 2, col: 6 },
      { char: ',', weight: 0.00, row: 2, col: 7 },
      { char: '.', weight: 0.00, row: 2, col: 8 }
    ]
  ],
  
  // 키 크기 및 위치 정보 (픽셀 단위)
  keyWidth: 60,
  keyHeight: 50,
  keySpacing: 2,
  
  // 팻핑거 보정을 위한 설정
  correctionRadius: 45 // 보정 범위 (픽셀)
};

// 키보드 위치 계산 함수
function getKeyPosition(row, col) {
  const x = col * (keyboardData.keyWidth + keyboardData.keySpacing);
  const y = row * (keyboardData.keyHeight + keyboardData.keySpacing);
  return { x, y };
}

// 두 점 사이의 거리 계산
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 팻핑거 보정 알고리즘
function correctFatFinger(touchX, touchY) {
  let candidates = [];
  
  // 모든 키에 대해 거리와 가중치를 계산
  keyboardData.layout.forEach(row => {
    row.forEach(key => {
      const keyPos = getKeyPosition(key.row, key.col);
      const keyCenterX = keyPos.x + keyboardData.keyWidth / 2;
      const keyCenterY = keyPos.y + keyboardData.keyHeight / 2;
      
      const distance = getDistance(touchX, touchY, keyCenterX, keyCenterY);
      
      // 보정 범위 내에 있는 키만 고려
      if (distance <= keyboardData.correctionRadius) {
        // 거리가 가까울수록, 가중치가 높을수록 점수가 높음
        const score = (key.weight * 100) / (distance + 1);
        candidates.push({
          key: key,
          distance: distance,
          score: score
        });
      }
    });
  });
  
  // 점수가 가장 높은 키 선택
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].key;
  }
  
  return null;
}

