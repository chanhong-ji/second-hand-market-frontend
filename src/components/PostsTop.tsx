import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ZoneBlock from './ZoneBlock';

const Title = styled.div``;
const Options = styled(motion.form)``;
const OptionBtn = styled.button``;
const Top = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 30px 40px 0px 40px;
  ${Title} {
    font-size: 17px;
    font-weight: 600;
    span {
      margin-left: 10px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  ${Options} {
    z-index: 1;
    padding: 10px;
    background-color: ${(p) => p.theme.color.bg.layout};
    border: 1px solid ${(p) => p.theme.color.border};
    border-radius: 10px;
    border-top-right-radius: 0;
    position: absolute;
    top: 50px;
    right: 40px;
    transform-origin: right top;
    display: flex;
    flex-direction: column;
    label {
      font-size: 15px;
      color: grey;
      font-weight: 600;
      margin-right: 5px;
    }
    select {
      border: none;
      outline: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background: none;
    }
    div:first-child {
      margin-bottom: 5px;
    }
    div:nth-child(2) {
      margin-bottom: 10px;
    }
    ${OptionBtn} {
      padding: 5px;
      border: none;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 5px;
    }
  }
`;

interface IProps {
  children?: any;
  register: UseFormRegister<any>;
  handleSubmit: any;
  loading: boolean;
}

function PostsTop({ handleSubmit, register, loading, children }: IProps) {
  const { search } = useLocation();
  const [menuClicked, setMenuClicked] = useState(false);
  const menuAnimation = useAnimation();

  useEffect(() => {
    if (menuClicked) {
      menuAnimation.start({ opacity: 1 });
    } else {
      menuAnimation.start({ opacity: 0 });
    }
  }, [menuClicked]);

  return (
    <Top>
      <Title>
        중고거래
        {search && <span>검색어: {search.split('=').slice(-1)}</span>}
      </Title>
      <FontAwesomeIcon
        icon={faBars}
        onClick={() => setMenuClicked((prev) => !prev)}
        style={{ cursor: 'pointer' }}
      />
      <Options
        onSubmit={handleSubmit}
        animate={menuAnimation}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ZoneBlock register={register}>
          <label htmlFor='zone'>Zone</label>
        </ZoneBlock>

        {children}

        <OptionBtn disabled={loading} onClick={handleSubmit}>
          검색
        </OptionBtn>
      </Options>
    </Top>
  );
}

export default PostsTop;
