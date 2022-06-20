import styled from 'styled-components';

interface IProps {
  size: number;
  url: string | null | undefined;
  onClick?: () => any;
}

const Container = styled.img<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: ${(p) => (p.size / 2).toPrecision()}px;
  background-color: grey;
  cursor: pointer;
`;

function Avatar({ size, url, onClick }: IProps) {
  return (
    <>
      {url ? (
        <Container size={size} src={url} onClick={onClick} />
      ) : (
        <Container size={size} onClick={onClick} />
      )}
    </>
  );
}

export default Avatar;
