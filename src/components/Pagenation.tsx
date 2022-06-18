import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const PrevBtn = styled.button``;
const NextBtn = styled.button``;
const TotalPage = styled.div``;
const P = styled.div<{ now: boolean }>`
  background-color: ${(p) => (p.now ? 'tomato' : 'inherit')};
  color: ${(p) => (p.now ? 'white' : 'black')};
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${P} {
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ${PrevBtn},
  ${NextBtn} {
    background: inherit;
    padding: 9px;
    padding-right: 12px;
    padding-left: 12px;
    text-align: center;
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  ${P},
  ${PrevBtn},
    ${NextBtn} {
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 5px;
    border: 1.5px solid ${(p) => p.theme.color.border};
  }
  ${TotalPage} {
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }
`;

interface IProps {
  page: number;
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function Pagination({ page, totalPage, setPage }: IProps) {
  const [curPages, setCurPages] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const stand = Math.floor((page - 1) / 10);
    const paginationArray = Array.from(Array(10).keys())
      .map((i) => stand * 10 + i + 1)
      .filter((i) => i <= totalPage);
    setCurPages(paginationArray);
  }, [totalPage]);

  return (
    <Wrapper>
      <PrevBtn disabled={page == 1} onClick={() => setPage((prev) => prev - 1)}>
        <FontAwesomeIcon style={{ marginRight: 10 }} icon={faAngleLeft} />
        Previous
      </PrevBtn>

      {curPages.map((n) => (
        <P key={n + ''} onClick={() => setPage(n)} now={n === page}>
          {n}
        </P>
      ))}

      <NextBtn
        disabled={page === totalPage}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next
        <FontAwesomeIcon style={{ marginLeft: 10 }} icon={faAngleRight} />
      </NextBtn>

      <TotalPage>Total {totalPage} pages</TotalPage>
    </Wrapper>
  );
}
export default Pagination;
