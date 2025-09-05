// Fix: Created constants.ts to define shared game constants.

export const REALMS = [
  { name: 'Luyện Khí Kỳ', qiPerSecondBonus: 0, lifespan: 100 },
  { name: 'Trúc Cơ Kỳ', qiPerSecondBonus: 10, lifespan: 200 },
  { name: 'Kim Đan Kỳ', qiPerSecondBonus: 100, lifespan: 500 },
  { name: 'Nguyên Anh Kỳ', qiPerSecondBonus: 1000, lifespan: 1000 },
  { name: 'Hóa Thần Kỳ', qiPerSecondBonus: 10000, lifespan: 5000 },
  { name: 'Luyện Hư Kỳ', qiPerSecondBonus: 100000, lifespan: 10000 },
  { name: 'Hợp Thể Kỳ', qiPerSecondBonus: 1000000, lifespan: 50000 },
  { name: 'Đại Thừa Kỳ', qiPerSecondBonus: 10000000, lifespan: 100000 },
  { name: 'Độ Kiếp Kỳ', qiPerSecondBonus: 100000000, lifespan: 200000 },
  { name: 'Tiên Nhân', qiPerSecondBonus: 1000000000, lifespan: Infinity },
];

export const APPEARANCES = [
    "Dung mạo bình thường",
    "Thanh tú thoát tục",
    "Anh tuấn bất phàm",
    "Vẻ đẹp yêu dị",
    "Khí chất cổ xưa",
    "Mày kiếm mắt sao",
    "Phượng mắt mày ngài",
    "Oai phong lẫm liệt",
];

export const formatNumber = (num: number, digits = 2): string => {
    if (num === 0) return '0';
    if (num < 1 && num > -1) return num.toFixed(2);
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(function(item) {
        return Math.abs(num) >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : num.toFixed(0);
};

export const formatQi = (num: number) => formatNumber(num, 2);
export const formatStones = (num: number) => formatNumber(num, 0);


export const SPIRIT_VEIN_MAX_CHARGE = 3600; // 1 hour of charge at 1 charge/sec
export const DAO_LU_RELATIONSHIP_REQUIREMENT = 100;
export const SONG_TU_COOLDOWN = 12 * 60 * 60 * 1000; // 12 hours
