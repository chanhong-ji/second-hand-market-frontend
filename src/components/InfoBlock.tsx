import styled from 'styled-components';

const Title = styled.div``;
const Category = styled.div``;
const Price = styled.div``;
const Exp = styled.div``;
const Info = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  border-top: 1px solid ${(p) => p.theme.color.border};
  min-height: 250px;
  position: relative;
  ${Title} {
    font-size: 20px;
    font-weight: 600;
  }
  ${Category} {
    font-size: 14px;
    margin-top: 5px;
    color: grey;
  }
  ${Price} {
    margin-top: 9px;
    font-size: 15px;
    font-weight: 600;
  }
  ${Exp} {
    margin-top: 20px;
    color: ${(p) => p.theme.color.font.exp};
  }
`;

interface IProps {
  title: string;
  caption: string;
  category: {
    id: number;
    name: string;
  };
}

function InfoBlock({ title, caption, category }: IProps) {
  return (
    <Info>
      <Title>{title}</Title>
      <Category>{category.name}</Category>
      {/* <Price>{price}</Price> */}
      <Price>15,000원</Price>
      <Exp>{`${caption}`}</Exp>
    </Info>
  );
}

export default InfoBlock;
