import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 25px;
  font-size: 25px;
  font-weight: 600;
  text-align: center;
`;

function Loader() {
  return <Wrapper>Loading...</Wrapper>;
}
export default Loader;
