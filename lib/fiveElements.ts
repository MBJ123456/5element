export type FiveElement = "金" | "木" | "水" | "火" | "土";

export interface FiveElementProfile {
  main: FiveElement;
  secondary: FiveElement;
  scores: Record<FiveElement, number>;
}

// 非严格命理，只是一个有趣的「占位」算法
export function analyzeFiveElementsFromBirthday(
  birthday: string | null | undefined
): FiveElementProfile {
  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];

  if (!birthday) {
    return {
      main: "木",
      secondary: "水",
      scores: {
        金: 60,
        木: 75,
        水: 70,
        火: 55,
        土: 65
      }
    };
  }

  const digits = birthday.replace(/\D/g, "");
  const base = digits.split("").reduce((sum, d) => sum + Number(d), 0) || 10;

  const scores: Record<FiveElement, number> = {
    金: 50 + ((base * 7) % 40),
    木: 50 + ((base * 5) % 40),
    水: 50 + ((base * 3) % 40),
    火: 50 + ((base * 9) % 40),
    土: 50 + ((base * 4) % 40)
  };

  const sorted = [...elements].sort((a, b) => scores[b] - scores[a]);

  return {
    main: sorted[0],
    secondary: sorted[1],
    scores
  };
}


