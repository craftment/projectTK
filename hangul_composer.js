// 한글 조합 엔진
class HangulComposer {
    constructor() {
        // 초성 (19개)
        this.chosung = [
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
            'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ];
        
        // 중성 (21개)
        this.jungsung = [
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
            'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
        ];
        
        // 종성 (28개, 빈 종성 포함)
        this.jongsung = [
            '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
            'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
            'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ];
        
        // 복합 모음 조합 규칙
        this.vowelCombinations = {
            'ㅗㅏ': 'ㅘ',
            'ㅗㅐ': 'ㅙ',
            'ㅗㅣ': 'ㅚ',
            'ㅜㅓ': 'ㅝ',
            'ㅜㅔ': 'ㅞ',
            'ㅜㅣ': 'ㅟ',
            'ㅡㅣ': 'ㅢ'
        };
        
        // 복합 자음 조합 규칙
        this.consonantCombinations = {
            'ㄱㅅ': 'ㄳ',
            'ㄴㅈ': 'ㄵ',
            'ㄴㅎ': 'ㄶ',
            'ㄹㄱ': 'ㄺ',
            'ㄹㅁ': 'ㄻ',
            'ㄹㅂ': 'ㄼ',
            'ㄹㅅ': 'ㄽ',
            'ㄹㅌ': 'ㄾ',
            'ㄹㅍ': 'ㄿ',
            'ㄹㅎ': 'ㅀ',
            'ㅂㅅ': 'ㅄ'
        };
        
        // 현재 조합 상태
        this.currentSyllable = {
            chosung: '',
            jungsung: '',
            jongsung: ''
        };
        
        // 조합 중인지 여부
        this.isComposing = false;
    }
    
    // 문자가 자음인지 확인
    isConsonant(char) {
        const consonants = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
        return consonants.includes(char);
    }
    
    // 문자가 모음인지 확인
    isVowel(char) {
        const vowels = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
        return vowels.includes(char);
    }
    
    // 한글 음절 조합
    composeSyllable(cho, jung, jong = '') {
        console.log(`composeSyllable 호출됨: cho=${cho}, jung=${jung}, jong=${jong}`);
        if (!cho) {
            console.log("composeSyllable: 초성 없음, 빈 문자열 반환");
            return ''; // 초성 없이는 조합 불가
        }
        
        const choIndex = this.chosung.indexOf(cho);
        const jungIndex = this.jungsung.indexOf(jung);
        const jongIndex = this.jongsung.indexOf(jong);
        
        if (choIndex === -1) {
            console.log("composeSyllable: 유효하지 않은 초성, 빈 문자열 반환");
            return ''; // 유효하지 않은 초성
        }

        // 중성이 없으면 초성만 반환
        if (!jung || jungIndex === -1) {
            console.log("composeSyllable: 중성 없음, 초성만 반환");
            return cho;
        }

        // 종성이 없으면 초성 + 중성만 조합
        if (!jong || jongIndex === -1) {
            const syllableCode = 0xAC00 + (choIndex * 21 + jungIndex) * 28;
            const result = String.fromCharCode(syllableCode);
            console.log(`composeSyllable: 종성 없음, 초성+중성 조합: ${result}`);
            return result;
        }
        
        const syllableCode = 0xAC00 + (choIndex * 21 + jungIndex) * 28 + jongIndex;
        const result = String.fromCharCode(syllableCode);
        console.log(`composeSyllable: 초성+중성+종성 조합: ${result}`);
        return result;
    }
    
    // 완성된 한글 음절을 자모로 분해
    decomposeSyllable(syllable) {
        console.log(`decomposeSyllable 호출됨: syllable=${syllable}`);
        const code = syllable.charCodeAt(0) - 0xAC00;
        if (code < 0 || code > 11171) {
            console.log("decomposeSyllable: 한글 음절 아님, null 반환");
            return null;
        }
        
        const jongIndex = code % 28;
        const jungIndex = Math.floor((code - jongIndex) / 28) % 21;
        const choIndex = Math.floor((code - jongIndex - jungIndex * 28) / (21 * 28));
        
        const decomposed = {
            chosung: this.chosung[choIndex],
            jungsung: this.jungsung[jungIndex],
            jongsung: this.jongsung[jongIndex]
        };
        console.log("decomposeSyllable: 분해 결과:", decomposed);
        return decomposed;
    }
    
    // 문자 입력 처리
    input(char) {
        console.log(`input 호출됨: char=${char}`);
        let outputChar = "";
        
        if (this.isConsonant(char)) {
            outputChar = this.handleConsonant(char);
        } else if (this.isVowel(char)) {
            outputChar = this.handleVowel(char);
        } else {
            // 특수문자나 숫자 등: 현재 조합 중인 글자를 완성하고, 새 문자를 반환
            if (this.isComposing) {
                outputChar = this.finishComposition() + char; // 완성된 글자 + 새 문자
            } else {
                outputChar = char;
            }
            this.reset(); // Reset for next input
        }
        console.log(`input 함수 종료, 반환 값: ${outputChar}`);
        return outputChar;
    }
    
    // 자음 입력 처리
    handleConsonant(char) {
        console.log(`handleConsonant 호출됨: char=${char}, isComposing=${this.isComposing}, currentSyllable=`, this.currentSyllable);
        let result = "";
        
        if (!this.isComposing) {
            // 새로운 조합 시작: 초성만 입력된 상태
            this.currentSyllable.chosung = char;
            this.isComposing = true;
            console.log(`handleConsonant: 새로운 조합 시작, 초성만 반환: ${char}`);
            return char; // 초성만 바로 출력
        } else if (!this.currentSyllable.jungsung) {
            // 초성만 있는 상태에서 자음이 또 들어오면 겹자음 시도
            const combined = this.consonantCombinations[this.currentSyllable.chosung + char];
            if (combined) {
                this.currentSyllable.chosung = combined;
                console.log(`handleConsonant: 겹자음 조합: ${combined}`);
                return combined; // 겹자음으로 변경된 초성 출력
            } else {
                // 겹자음이 안 되면 현재 조합 완료하고 새 글자 시작
                result = this.finishComposition();
                this.currentSyllable.chosung = char;
                this.isComposing = true;
                console.log(`handleConsonant: 겹자음 불가, 새 글자 시작: ${result + char}`);
                return result + char;
            }
        } else if (!this.currentSyllable.jongsung) {
            // 중성까지 있는 상태에서 자음이 들어오면 종성으로
            this.currentSyllable.jongsung = char;
            const composed = this.composeSyllable(
                this.currentSyllable.chosung,
                this.currentSyllable.jungsung,
                this.currentSyllable.jongsung
            );
            console.log(`handleConsonant: 종성 추가, 조합된 글자: ${composed}`);
            return composed;
        } else {
            // 종성까지 있는 상태에서 자음이 들어오면 복합 종성 시도
            const combined = this.consonantCombinations[this.currentSyllable.jongsung + char];
            if (combined) {
                this.currentSyllable.jongsung = combined;
                const composed = this.composeSyllable(
                    this.currentSyllable.chosung,
                    this.currentSyllable.jungsung,
                    this.currentSyllable.jongsung
                );
                console.log(`handleConsonant: 복합 종성 조합: ${composed}`);
                return composed;
            } else {
                // 복합 종성이 안 되면 현재 조합 완료하고 새 글자 시작
                result = this.finishComposition();
                this.currentSyllable.chosung = char;
                this.isComposing = true;
                console.log(`handleConsonant: 복합 종성 불가, 새 글자 시작: ${result + char}`);
                return result + char;
            }
        }
    }
    
    // 모음 입력 처리
    handleVowel(char) {
        console.log(`handleVowel 호출됨: char=${char}, isComposing=${this.isComposing}, currentSyllable=`, this.currentSyllable);
        let result = "";
        
        if (!this.isComposing || !this.currentSyllable.chosung) {
            // 초성 없이 모음이 입력된 경우: 모음만 출력
            this.reset();
            console.log(`handleVowel: 초성 없음 또는 조합 중 아님, 모음만 반환: ${char}`);
            return char;
        } else if (!this.currentSyllable.jungsung) {
            // 초성만 있는 상태에서 모음이 들어오면 중성으로
            this.currentSyllable.jungsung = char;
            const composed = this.composeSyllable(
                this.currentSyllable.chosung,
                this.currentSyllable.jungsung
            );
            console.log(`handleVowel: 중성 추가, 조합된 글자: ${composed}`);
            return composed;
        } else {
            // 중성까지 있는 상태에서 모음이 들어오면 복합 모음 시도
            const combined = this.vowelCombinations[this.currentSyllable.jungsung + char];
            if (combined) {
                this.currentSyllable.jungsung = combined;
                const composed = this.composeSyllable(
                    this.currentSyllable.chosung,
                    this.currentSyllable.jungsung,
                    this.currentSyllable.jongsung
                );
                console.log(`handleVowel: 복합 모음 조합: ${composed}`);
                return composed;
            } else {
                // 복합 모음이 안 되면 종성을 초성으로 이동하거나 새 글자 시작
                if (this.currentSyllable.jongsung) {
                    const oldJongsung = this.currentSyllable.jongsung;
                    result = this.composeSyllable(
                        this.currentSyllable.chosung,
                        this.currentSyllable.jungsung,
                        "" // 종성 없이 이전 글자 완성
                    );
                    this.reset(); // reset 호출 위치 변경
                    this.currentSyllable.chosung = oldJongsung;
                    this.currentSyllable.jungsung = char;
                    this.currentSyllable.jongsung = "";
                    this.isComposing = true; // 조합 중 상태로 설정
                    const newComposed = this.composeSyllable(
                        this.currentSyllable.chosung,
                        this.currentSyllable.jungsung
                    );
                    console.log(`handleVowel: 복합 모음 불가, 종성 이동 및 새 글자 시작: ${result + newComposed}`);
                    return result + newComposed;
                } else {
                    // 종성이 없으면 현재 조합 완료하고 새 글자 시작 (모음만)
                    result = this.finishComposition();
                    this.reset();
                    console.log(`handleVowel: 복합 모음 불가, 새 글자 시작 (모음만): ${result + char}`);
                    return result + char;
                }
            }
        }
    }
    
    // 현재 조합 완료
    finishComposition() {
        console.log("finishComposition 호출됨");
        if (!this.isComposing) {
            console.log("finishComposition: 조합 중 아님, 빈 문자열 반환");
            return "";
        }
        
        const result = this.composeSyllable(
            this.currentSyllable.chosung,
            this.currentSyllable.jungsung,
            this.currentSyllable.jongsung
        );
        
        this.reset();
        console.log(`finishComposition: 조합 완료, 결과: ${result}`);
        return result;
    }
    
    // 현재 조합 중인 글자 반환 (미완성 포함)
    getCurrentComposition() {
        console.log("getCurrentComposition 호출됨");
        if (!this.isComposing) {
            console.log("getCurrentComposition: 조합 중 아님, 빈 문자열 반환");
            return "";
        }
        
        const result = this.composeSyllable(
            this.currentSyllable.chosung,
            this.currentSyllable.jungsung,
            this.currentSyllable.jongsung
        );
        console.log(`getCurrentComposition: 현재 조합: ${result}`);
        return result;
    }
    
    // 백스페이스 처리
    backspace() {
        console.log("backspace 호출됨");
        if (!this.isComposing) {
            console.log("backspace: 조합 중 아님, 빈 문자열 반환");
            return "";
        }
        
        if (this.currentSyllable.jongsung) {
            // 종성 제거
            // 복합 종성인 경우 분해
            let decomposed = false;
            for (const key in this.consonantCombinations) {
                if (this.consonantCombinations[key] === this.currentSyllable.jongsung) {
                    this.currentSyllable.jongsung = key[0];
                    decomposed = true;
                    console.log(`backspace: 복합 종성 분해: ${this.currentSyllable.jongsung}`);
                    break;
                }
            }
            if (!decomposed) {
                this.currentSyllable.jongsung = "";
                console.log("backspace: 종성 제거");
            }
        } else if (this.currentSyllable.jungsung) {
            // 중성 제거
            // 복합 모음인 경우 분해
            let decomposed = false;
            for (const key in this.vowelCombinations) {
                if (this.vowelCombinations[key] === this.currentSyllable.jungsung) {
                    this.currentSyllable.jungsung = key[0];
                    decomposed = true;
                    console.log(`backspace: 복합 모음 분해: ${this.currentSyllable.jungsung}`);
                    break;
                }
            }
            if (!decomposed) {
                this.currentSyllable.jungsung = "";
                console.log("backspace: 중성 제거");
            }
        } else if (this.currentSyllable.chosung) {
            // 초성 제거
            this.currentSyllable.chosung = "";
            this.isComposing = false;
            console.log("backspace: 초성 제거");
        }
        
        // 조합된 글자 반환
        return this.getCurrentComposition();
    }
    
    // 조합 상태 초기화
    reset() {
        console.log("reset 호출됨");
        this.currentSyllable = {
            chosung: "",
            jungsung: "",
            jongsung: ""
        };
        this.isComposing = false;
    }
}

// 전역 인스턴스 생성
const hangulComposer = new HangulComposer();



