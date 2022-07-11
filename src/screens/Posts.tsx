import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Outlet } from 'react-router-dom';
import Grid from '../components/Grid';
import Loader from '../components/Loader';
import Pagination from '../components/Pagenation';
import PostsTop from '../components/PostsTop';
import { PostsWrapper } from '../shared/components';
import { POST_FRAGMENT_FOR_BANNER } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { seePosts, seePostsVariables } from '../__generated__/seePosts';
import { PER_PAGE } from '../shared/constant';

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

  const onOptionValid: SubmitHandler<seePostsVariables> = async ({
    categoryName,
    zoneFirst,
    zoneSecond,
  }) => {
    setPage(1);
    await refetch({
      zoneFirst: +zoneFirst,
      zoneSecond: +zoneSecond,
      categoryName: categoryName === 'all' ? undefined : categoryName,
      page: 1,
    });
  };

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
      {loading ? (
        <Loader />
      ) : (
        <>
          <PostsTop
            register={register}
            handleSubmit={handleSubmit(onOptionValid)}
            loading={loading}
          />

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
