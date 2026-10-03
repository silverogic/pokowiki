/**
 * 숫자 비교 정렬 함수
 * - 오름차순(ascend) 정렬 시 NaN, null, undefined 등 결측치는 항상 맨 끝으로 정렬
 * - silverogic/uxui 가이드라인(others.md) 준수
 */
export const compareNumeric = (a?: number | null, b?: number | null): number => {
  const isANaN = a == null || Number.isNaN(a);
  const isBNaN = b == null || Number.isNaN(b);

  if (isANaN && isBNaN) return 0;
  if (isANaN) return 1;
  if (isBNaN) return -1;

  return (a as number) - (b as number);
};
