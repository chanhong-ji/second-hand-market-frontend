import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Outlet, useLocation } from 'react-router-dom';
import Grid from '../components/Grid';
import Loader from '../components/Loader';
import Pagination from '../components/Pagenation';
import Filter from '../components/Filter';
import GetMeUser from '../hooks/getMeUser';
import { PostsWrapper } from '../shared/components';
import { seePosts, seePostsVariables } from '../__generated__/seePosts';
import { POST_FRAGMENT_FOR_BANNER } from '../fragment';
import { PER_PAGE } from '../shared/constant';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';

const Title = styled.div``;
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
`;

const SEE_POSTS_QUERY = gql`
  query seePosts(
    $zoneFirst: Int!
    $zoneSecond: Int!
    $categoryName: String
    $page: Int
  ) {
    seePosts(
      zoneFirst: $zoneFirst
      zoneSecond: $zoneSecond
      categoryName: $categoryName
      page: $page
    ) {
      posts {
        ...PostFragmentForBanner
      }
      totalResults
    }
  }
  ${POST_FRAGMENT_FOR_BANNER}
`;

function Posts() {
  const onFetchCompleted = (data: seePosts) => {
    const { totalResults } = data.seePosts;
    setTotalPage(Math.ceil(totalResults / PER_PAGE));
  };

  const onPageChanged = () => {
    const { zoneFirst, zoneSecond, categoryName } = getValues();
    if (zoneFirst && zoneSecond) {
      refetch({
        zoneFirst: +zoneFirst,
        zoneSecond: +zoneSecond,
        categoryName: categoryName === 'all' ? undefined : categoryName,
        page,
      });
    }
  };

  const onOptionValid: SubmitHandler<seePostsVariables> = ({
    categoryName,
    zoneFirst,
    zoneSecond,
  }) => {
    if (loading) return;
    setPage(1);
    refetch({
      zoneFirst: +zoneFirst,
      zoneSecond: +zoneSecond,
      categoryName: categoryName === 'all' ? undefined : categoryName,
      page: 1,
    });
  };

  const { search } = useLocation();
  const { register, handleSubmit, getValues } = useForm<seePostsVariables>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const meData = GetMeUser();
  const { data, loading, refetch } = useQuery<seePosts>(SEE_POSTS_QUERY, {
    variables: {
      zoneFirst: meData?.me?.zoneId ? +meData.me.zoneId.slice(0, -2) : 0,
      zoneSecond: meData?.me?.zoneId ? +meData.me.zoneId.slice(-2) : 0,
    },
    refetchWritePolicy: 'overwrite',
    onCompleted: onFetchCompleted,
  });

  useEffect(() => {
    onPageChanged();
  }, [page]);

  return (
    <PostsWrapper>
      <PageTitle title='Home' />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Top>
            <Title>
              중고거래
              {search && <span>검색어: {search.split('=').slice(-1)}</span>}
            </Title>
            <Filter
              register={register}
              handleSubmit={handleSubmit(onOptionValid)}
              loading={loading}
            />
          </Top>

          {!!data?.seePosts.posts && <Grid posts={data.seePosts.posts} />}

          {!!data?.seePosts.totalResults && (
            <Pagination page={page} setPage={setPage} totalPage={totalPage} />
          )}

          <Outlet />
        </>
      )}
    </PostsWrapper>
  );
}

export default Posts;
