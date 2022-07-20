import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { seeInterests } from '../__generated__/seeInterests';
import {
  toggleInterest,
  toggleInterestVariables,
} from '../__generated__/toggleInterest';
import { TOGGLE_INTEREST_MUTATION } from './OwnerBlock';
import { onToggleInterestUpdate } from '../shared/utils';
import { useEffect } from 'react';
import { useViewportScroll } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { interestCountState } from '../atoms';
import { POST_FRAGMENT_FOR_BANNER } from '../fragment';

const SEE_INTEREST_QUERY = gql`
  query seeInterests($offset: Int) {
    seeInterests(offset: $offset) {
      id
      post {
        ...PostFragmentForBanner
      }
    }
  }
  ${POST_FRAGMENT_FOR_BANNER}
`;

const Photo = styled.div<{ url: string }>`
  background-image: ${(p) => `url(${p.url})`};
  background-size: cover;
  background-position: center;
`;
const Info = styled.div``;
const Title = styled.div``;
const Price = styled.div``;
const BookmarkBtn = styled.div``;
const Banner = styled.div`
  width: 100%;
  min-width: 300px;
  height: 250px;
  display: flex;
  border-radius: 1px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  cursor: pointer;
  display: grid;
  grid-template-rows: 3fr 1fr;
  ${Photo} {
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    position: relative;
    ${BookmarkBtn} {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 25px;
      * {
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      }
    }
  }
  ${Info} {
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    padding-left: 15px;
    justify-content: center;
    overflow: hidden;
    ${Title} {
      font-size: 15px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
    }
    ${Price} {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

function InterestBlock({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const { scrollYProgress } = useViewportScroll();
  const [interestCount, setInterestCount] = useRecoilState(interestCountState);

  const [toggleInterest] = useMutation<toggleInterest, toggleInterestVariables>(
    TOGGLE_INTEREST_MUTATION,
    {
      update: (cache, result) => onToggleInterestUpdate(cache, result, userId),
    }
  );
  const { data, refetch, fetchMore } =
    useQuery<seeInterests>(SEE_INTEREST_QUERY);

  useEffect(() => {
    scrollYProgress.onChange(async (value) => {
      if (value > 0.95 && !!data?.seeInterests) {
        await fetchMore({
          variables: {
            offset: data.seeInterests.length,
          },
        });
        scrollYProgress.clearListeners();
      }
    });
  }, [data]);

  const refetching: any = useApolloClient().cache.readFragment({
    id: `User:${userId}`,
    fragment: gql`
      fragment UserFragmentForInterest on User {
        interestCount
      }
    `,
  });

  useEffect(() => {
    if (
      refetching?.interestCount &&
      refetching.interestCount !== interestCount
    ) {
      setInterestCount(refetching.interestCount);
      refetch({ variable: { userId } });
    }
  }, []);

  return (
    <>
      {data?.seeInterests.map(
        (value) =>
          !!value && (
            <Banner
              key={value.id + ''}
              onClick={() => navigate(`/posts/${value.post.id}`)}
            >
              <Photo url={value.post.photos[0]}>
                <BookmarkBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInterest({ variables: { id: value.post.id } });
                  }}
                >
                  <FontAwesomeIcon
                    icon={value.post.isInterest ? faSolidHeart : faHeart}
                    color={value.post.isInterest ? 'red' : 'white'}
                  />
                </BookmarkBtn>
              </Photo>
              <Info>
                <Title>{value.post.title}</Title>
                <Price>{value.post.price} 원</Price>
              </Info>
            </Banner>
          )
      )}
    </>
  );
}

export default InterestBlock;
