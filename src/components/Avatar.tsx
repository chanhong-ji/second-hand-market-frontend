import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

interface IProps {
  size: number;
  url: string | null | undefined;
  onClick?: () => any;
  type?: string;
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
        <FontAwesomeIcon
          icon={faCircleUser}
          onClick={onClick}
          fontSize={size}
          color='rgba(0, 0, 0, 0.5)'
        />
      )}
    </>
  );
}

export default Avatar;
