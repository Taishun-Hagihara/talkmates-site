//理解済み
// イベント参加フォームの選択肢
// 後から変更しやすいようにここで一元管理

export const campusOptions = [
    { value: "imadegawa", label: "今出川キャンパス", labelEn: "Imadegawa Campus" },
    { value: "kyotanabe", label: "京田辺キャンパス", labelEn: "Kyotanabe Campus" },
    { value: "other", label: "その他", labelEn: "Other" },
];

export const japaneseLevelOptions = [
    { value: "native", label: "ネイティブ", labelEn: "Native" },
    { value: "n1", label: "N1相当", labelEn: "N1 Level" },
    { value: "n2", label: "N2相当", labelEn: "N2 Level" },
    { value: "n3", label: "N3相当", labelEn: "N3 Level" },
    { value: "n4", label: "N4相当", labelEn: "N4 Level" },
    { value: "n5", label: "N5相当", labelEn: "N5 Level" },
    { value: "beginner", label: "初心者", labelEn: "Beginner" },
];

export const japaneseMotivationOptions = [
    { value: "improve", label: "日本語を上達させたい", labelEn: "I want to improve my Japanese" },
    { value: "friends", label: "日本人の友達を作りたい", labelEn: "I want to make Japanese friends" },
    { value: "culture", label: "日本文化に興味がある", labelEn: "I'm interested in Japanese culture" },
    { value: "fun", label: "楽しそうだから", labelEn: "It looks fun" },
    { value: "other", label: "その他", labelEn: "Other" },
];

export const englishLevelOptions = [
    { value: "native", label: "ネイティブ", labelEn: "Native" },
    { value: "advanced", label: "上級", labelEn: "Advanced" },
    { value: "intermediate", label: "中級", labelEn: "Intermediate" },
    { value: "beginner", label: "初級", labelEn: "Beginner" },
    { value: "none", label: "ほとんど話せない", labelEn: "Almost none" },
];
