import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 3;
`;
const ModalDiv = styled(motion.div)`
  width: 50%;
  min-width: 700px;
  height: 80%;
  position: absolute;
  border-radius: 20px;
  background-color: white;
  padding-top: 40px;
  display: grid;
`;
const Cancel = styled.div``;
const Title = styled.div``;
const Complete = styled.div``;
const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 40px;
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  position: absolute;
  top: 0;
  padding-left: 10px;
  padding-right: 10px;

  ${Cancel} {
    color: tomato;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  ${Title} {
    font-size: 18px;
    font-weight: 500;
  }
  ${Complete} {
    color: blue;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
`;

interface IProps {
  completeFn: any;
  children: any;
  title: string;
  styles?: object;
}

function Modal({ completeFn, children, title, styles }: IProps) {
  const onCancel = () => {
    const cancel = window.confirm('Do you want to cancel to edit this post?');
    if (cancel) {
      navigate(-1);
    } else {
      return;
    }
  };

  const navigate = useNavigate();
  const modalVariant = {
    initial: {
      opacity: 0,
      scale: 0.7,
    },
    final: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Overlay onClick={() => onCancel()}>
      <ModalDiv
        onClick={(e) => e.stopPropagation()}
        variants={modalVariant}
        initial='initial'
        animate='final'
        style={styles}
      >
        <TopBar>
          <Cancel onClick={onCancel}>Cancel</Cancel>
          <Title>{title}</Title>
          <Complete onClick={completeFn}>Complete</Complete>
        </TopBar>
        {children}
      </ModalDiv>
    </Overlay>
  );
}

export default Modal;
