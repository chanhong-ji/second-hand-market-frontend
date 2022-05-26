import styled from 'styled-components';

interface IProps {
  size: number;
  url: string;
}

const Container = styled.img<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: ${(p) => p.size / 2}px;
  background-color: grey;
`;

function Avatar({ size, url }: IProps) {
  return <Container size={size} src={url}></Container>;
}

export default Avatar;
