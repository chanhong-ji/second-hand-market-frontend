export const getFormatValue = (value: number) => {
  const formatValue = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
  return formatValue;
};

export const getZoneId = (first: string, second: string) => {
  const secondZoneCode = second.padStart(2, '0');
  return +(first + secondZoneCode);
};
