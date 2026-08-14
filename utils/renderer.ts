export const renderId = (index: number) =>
  `${(index % 10000).toString().padStart(3, "0")}${index > 10000 && index < 20000 ? "（活动）" : ""}${index > 20000 ? "（海底）" : ""}`;
