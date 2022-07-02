import { motion, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { seeProfile_seeProfile } from '../__generated__/seeProfile';
import FollowingBlock from './FollowingBlock';
import InterestBlock from './InterestBlock';
import ItemBanner from './ItemBanner';

const Column = styled.div``;
const Indicator = styled(motion.div)``;
const NavBar = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  display: flex;
  align-items: center;
  ${Column} {
    padding: 10px 20px;
    position: relative;
    cursor: pointer;
    ${Indicator} {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 5px;
      width: 100%;
      background-color: tomato;
    }
  }
`;
const Bottom = styled.article<{ index: number }>`
  width: 100%;
  padding: 50px 0;
  display: grid;
  gap: 40px;
  grid-template-columns: ${(p) => (p.index === 0 ? '1fr 1fr 1fr' : '1fr 1fr')};
`;

function ProfileBottom(props: seeProfile_seeProfile) {
  const [index, setIndex] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    setIndex(0);
  }, [pathname.split('/').pop()]);

  return (
    <>
      <NavBar>
        <Column id='0' onClick={(e) => setIndex(+e.currentTarget.id)}>
          판매물품 ({props.postsCount})
          {index === 0 && <Indicator layoutId='indexIndicator' />}
        </Column>
        {props.isMe && (
          <>
            <Column id='1' onClick={(e) => setIndex(+e.currentTarget.id)}>
              팔로잉 ({props.followingCount ?? ''})
              {index === 1 && <Indicator layoutId='indexIndicator' />}
            </Column>
            <Column id='2' onClick={(e) => setIndex(+e.currentTarget.id)}>
              관심 포스트 ({props.interestCount ?? ''})
              {index === 2 && <Indicator layoutId='indexIndicator' />}
            </Column>
          </>
        )}
      </NavBar>
      <Bottom index={index}>
        {index === 0 ? (
          props.posts?.map((post) =>
            post?.id ? <ItemBanner {...post} key={post.id} /> : null
          )
        ) : index === 1 ? (
          <FollowingBlock {...props} />
        ) : index === 2 ? (
          <InterestBlock userId={props.id} />
        ) : null}
      </Bottom>
    </>
  );
}

export default ProfileBottom;
