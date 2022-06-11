export const getFormatValue = (value: number) => {
  const formatValue = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
  return formatValue;
};
