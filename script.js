

// 전역 변수 선언
let textInput, keyboard, clearBtn, spaceBtn, backspaceBtn;
let touchPos, selectedKey, correctionApplied;

// 키보드 생성
function createKeyboard() {
  console.log("createKeyboard 함수 호출됨");
  if (!keyboard) {
    console.error("createKeyboard: keyboard 요소가 null입니다.");
    return;
  }
  console.log("createKeyboard: keyboard 요소 확인됨", keyboard);
  keyboard.innerHTML = "";
  console.log("createKeyboard: keyboard.innerHTML 초기화됨");

  if (!keyboardData || !keyboardData.layout || keyboardData.layout.length === 0) {
    console.error("createKeyboard: keyboardData 또는 layout이 정의되지 않았거나 비어 있습니다.");
    return;
  }
  console.log("createKeyboard: keyboardData.layout 길이:", keyboardData.layout.length);

  keyboardData.layout.forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboard-row";
    console.log(`createKeyboard: ${rowIndex}번째 rowElement 생성됨`);

    row.forEach((keyData, colIndex) => {
      const keyElement = document.createElement("button");
      keyElement.className = "key";
      keyElement.textContent = keyData.char;
      keyElement.dataset.char = keyData.char;
      keyElement.dataset.weight = keyData.weight;
      keyElement.dataset.row = rowIndex;
      keyElement.dataset.col = colIndex;

      // 가중치에 따른 스타일 적용
      if (keyData.weight >= 0.15) {
        keyElement.classList.add("high-weight");
      } else if (keyData.weight >= 0.08) {
        keyElement.classList.add("medium-weight");
      } else {
        keyElement.classList.add("low-weight");
      }

      // 가중치 표시
      const weightSpan = document.createElement("span");
      weightSpan.className = "weight";
      weightSpan.textContent = keyData.weight.toFixed(2);
      keyElement.appendChild(weightSpan);

      rowElement.appendChild(keyElement);
      console.log(`createKeyboard: 키 ${keyData.char} (${rowIndex}, ${colIndex}) rowElement에 추가됨`);
    });

    keyboard.appendChild(rowElement);
    console.log(`createKeyboard: rowElement ${rowIndex} keyboard에 추가됨`);
  });
  console.log("createKeyboard 함수 완료. 최종 키보드 자식 요소 수:", keyboard.children.length);
}

// 두 점 사이의 거리 계산
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 팻핑거 보정 알고리즘
function correctFatFinger(touchX, touchY, keyboardRect) {
  let candidates = [];

  // 모든 키에 대해 거리와 가중치를 계산
  const keys = keyboard.querySelectorAll(".key");
  keys.forEach((keyElement) => {
    const keyRect = keyElement.getBoundingClientRect();
    const keyCenterX = keyRect.left + keyRect.width / 2 - keyboardRect.left;
    const keyCenterY = keyRect.top + keyRect.height / 2 - keyboardRect.top;

    const distance = getDistance(touchX, touchY, keyCenterX, keyCenterY);
    const weight = parseFloat(keyElement.dataset.weight);

    // 보정 범위 내에 있는 키만 고려
    if (distance <= keyboardData.correctionRadius) {
      // 거리가 가까울수록, 가중치가 높을수록 점수가 높음
      // 가중치를 더 강하게 반영하도록 수정
      const score = weight * 1000 - distance; // 가중치에 큰 가중을 주고 거리를 뺌
      candidates.push({
        element: keyElement,
        char: keyElement.dataset.char,
        distance: distance,
        weight: weight,
        score: score,
      });
    }
  });

  // 점수가 가장 높은 키 선택
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
  }

  return null;
}

// 키 입력 처리
function handleKeyInput(char, isCorrected = false) {
  console.log(`handleKeyInput 호출됨: char=${char}, isCorrected=${isCorrected}`);
  const currentText = textInput.value;
  let newText = currentText;

  if (char === " ") {
    newText += " ";
    hangulComposer.reset(); // 공백 입력 시 조합 초기화
  } else if (char === "BACKSPACE") {
    if (hangulComposer.isComposing) {
      const composed = hangulComposer.backspace();
      if (composed === '') {
        newText = currentText.slice(0, -1);
      } else {
        newText = currentText.slice(0, -1) + composed;
      }
    } else {
      newText = currentText.slice(0, -1);
    }
  } else if (char === "CLEAR") {
    newText = "";
    hangulComposer.reset();
  } else {
    // 한글 조합기 사용
    console.log("한글 조합기 입력 시도: ", char);
    const composedChar = hangulComposer.input(char);
    console.log("조합된 문자: ", composedChar);

    // 조합 중인지 여부에 따라 처리
    if (hangulComposer.isComposing) {
      // 조합 중인 경우, 마지막 글자를 대체
      if (currentText.length > 0) {
        newText = currentText.slice(0, -1) + composedChar;
      } else {
        newText = composedChar;
      }
    } else {
      // 조합이 완료되었거나 조합 중이 아닌 경우
      newText = currentText + composedChar;
    }
  }

  textInput.value = newText;
  console.log("textInput.value 업데이트됨:", textInput.value);

  // 보정된 키에 시각적 효과 추가
  if (isCorrected) {
    const correctedKey = keyboard.querySelector(`[data-char="${char}"]`);
    if (correctedKey) {
      correctedKey.classList.add("corrected");
      setTimeout(() => {
        correctedKey.classList.remove("corrected");
      }, 300);
    }
  }
}

// 터치 이벤트 처리
function handleTouch(event) {
  event.preventDefault();
  console.log("handleTouch 호출됨");

  const touch = event.touches ? event.touches[0] : event;
  const keyboardRect = keyboard.getBoundingClientRect();
  const touchX = touch.clientX - keyboardRect.left;
  const touchY = touch.clientY - keyboardRect.top;

  // 디버그 정보 업데이트
  touchPos.textContent = `(${Math.round(touchX)}, ${Math.round(touchY)})`;
  console.log(`터치 위치: (${Math.round(touchX)}, ${Math.round(touchY)})`);

  // 팻핑거 보정 적용
  const correctedKey = correctFatFinger(touchX, touchY, keyboardRect);
  console.log("보정된 키:", correctedKey);

  let isCorrected = false; // isCorrected 변수를 여기서 선언 및 초기화

  if (correctedKey) {
    // 실제 터치된 키 찾기
    const actualTouchedElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (actualTouchedElement && actualTouchedElement.classList.contains("key")) {
      isCorrected = actualTouchedElement.dataset.char !== correctedKey.char;
      console.log(`실제 터치된 키: ${actualTouchedElement.dataset.char}, 보정된 키: ${correctedKey.char}, 보정 여부: ${isCorrected}`);
    }
    console.log(`실제 터치된 요소: ${actualTouchedElement ? actualTouchedElement.dataset.char : '없음'}, 보정 여부: ${isCorrected}`);

    // 디버그 정보 업데이트
    selectedKey.textContent = correctedKey.char;
    // 보정 여부 판단: 실제 터치된 키가 없거나, 실제 터치된 키와 보정된 키가 다르면 '예'
    // 또는, 터치된 위치가 어떤 키의 중심에서도 멀리 떨어져 보정 로직이 개입했다면 '예'
    if (actualTouchedElement && actualTouchedElement.classList.contains("key")) {
      isCorrected = actualTouchedElement.dataset.char !== correctedKey.char;
    } else {
      // 실제 터치된 키가 없는 경우 (키와 키 사이를 터치한 경우) 보정으로 간주
      isCorrected = true;
    }
    correctionApplied.textContent = isCorrected ? "예" : "아니오";

    handleKeyInput(correctedKey.char, isCorrected);
  } else {
    // correctedKey가 없는 경우 디버그 정보 초기화
    selectedKey.textContent = "-";
    correctionApplied.textContent = "아니오"; // 보정되지 않았으므로 '아니오'로 설정
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 키보드 터치 이벤트
  keyboard.addEventListener("touchstart", handleTouch, { passive: false });
  keyboard.addEventListener("touchend", (e) => e.preventDefault(), { passive: false });

  // 마우스 이벤트 (데스크톱 테스트용)
  keyboard.addEventListener("mousedown", handleTouch);

  // 키보드 클릭 이벤트 (기본 동작)
  keyboard.addEventListener("click", (event) => {
    if (event.target.classList.contains("key")) {
      const char = event.target.dataset.char;
      handleKeyInput(char, false);
    }
  });

  // 컨트롤 버튼들
  clearBtn.addEventListener("click", () => {
    handleKeyInput("CLEAR");
  });

  spaceBtn.addEventListener("click", () => {
    handleKeyInput(" ");
  });

  backspaceBtn.addEventListener("click", () => {
    handleKeyInput("BACKSPACE");
  });
}

// 초기화 함수
function init() {
    console.log("init 함수 시작");
    // DOM 요소들 초기화
    textInput = document.getElementById("textInput");
    keyboard = document.getElementById("keyboard");
    clearBtn = document.getElementById("clearBtn");
    spaceBtn = document.getElementById("spaceBtn");
    backspaceBtn = document.getElementById("backspaceBtn");
    touchPos = document.getElementById("touchPos");
    selectedKey = document.getElementById("selectedKey");
    correctionApplied = document.getElementById("correctionApplied");
    
    console.log("init: textInput:", textInput);
    console.log("init: keyboard:", keyboard);
    
    // keyboardData 확인
    console.log("init: keyboardData:", keyboardData);
    console.log("init: keyboardData.layout:", keyboardData ? keyboardData.layout : "undefined");
    
    createKeyboard();
    setupEventListeners();
    console.log("init: setupEventListeners 호출 완료");

    // 터치 디바이스 감지 및 안내 메시지
    if ("ontouchstart" in window) {
      console.log("터치 디바이스가 감지되었습니다. 팻핑거 보정 기능이 활성화됩니다.");
    } else {
      console.log("마우스 환경입니다. 클릭으로 테스트할 수 있습니다.");
    }
    console.log("init 함수 종료");
}

// DOM이 준비되면 초기화 함수 호출







window.addEventListener("DOMContentLoaded", init);

