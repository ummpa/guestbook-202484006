// A food emoji for a 식당 name, so each 글 card gets its own little picture.
const FOOD: [RegExp, string][] = [
  [/국밥|탕|찌개|전골|곰|해장/, "🍲"],
  [/라멘|라면|우동|소바|짬뽕|국수|냉면|면/, "🍜"],
  [/짜장|중식|중국|반점|마라/, "🥡"],
  [/초밥|스시|회|오마카세|횟집/, "🍣"],
  [/치킨|닭/, "🍗"],
  [/고기|갈비|삼겹|한우|소고기|돼지|곱창|막창|정육/, "🥩"],
  [/피자/, "🍕"],
  [/버거|햄버거/, "🍔"],
  [/파스타|양식|스테이크|비스트로/, "🍝"],
  [/카페|커피|coffee|cafe/i, "☕"],
  [/빵|베이커리|bakery|크루아상|도넛/i, "🥐"],
  [/디저트|케이크|빙수|아이스/, "🍰"],
  [/떡볶이|분식|김밥|순대/, "🍢"],
  [/만두|딤섬/, "🥟"],
  [/카레|인도/, "🍛"],
  [/타코|멕시/, "🌮"],
  [/비빔밥|한정식|백반|밥/, "🍚"],
  [/술|포차|주점|호프|이자카야/, "🍶"],
];

export function foodEmoji(restaurant: string) {
  return FOOD.find(([pattern]) => pattern.test(restaurant))?.[1] ?? "🍽️";
}

// Each 지역 gets its own sticker color.
const REGION_COLORS: Record<string, string> = {
  서울: "bg-rose-100 text-rose-700",
  부산: "bg-sky-100 text-sky-700",
  대구: "bg-orange-100 text-orange-700",
  인천: "bg-cyan-100 text-cyan-700",
  광주: "bg-lime-100 text-lime-700",
  대전: "bg-violet-100 text-violet-700",
  울산: "bg-teal-100 text-teal-700",
  세종: "bg-indigo-100 text-indigo-700",
  경기: "bg-amber-100 text-amber-800",
  강원: "bg-emerald-100 text-emerald-700",
  충북: "bg-fuchsia-100 text-fuchsia-700",
  충남: "bg-pink-100 text-pink-700",
  전북: "bg-yellow-100 text-yellow-800",
  전남: "bg-green-100 text-green-700",
  경북: "bg-red-100 text-red-700",
  경남: "bg-blue-100 text-blue-700",
  제주: "bg-orange-100 text-orange-600",
};

export function regionColor(region: string) {
  return REGION_COLORS[region] ?? "bg-orange-soft text-orange-dark";
}
