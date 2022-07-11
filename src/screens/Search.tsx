import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import Grid from '../components/Grid';
import Loader from '../components/Loader';
import Pagination from '../components/Pagenation';
import PostsTop from '../components/PostsTop';
import { PostsWrapper } from '../shared/components';
import { POST_FRAGMENT } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { searchPost, searchPostVariables } from '../__generated__/searchPost';
import { PER_PAGE } from '../shared/constant';

const SEARCH_POST_QUERY = gql`
  query searchPost(
    $keyword: String!
    $zoneFirst: Int!
    $zoneSecond: Int!
    $page: Int
  ) {
    searchPost(
      keyword: $keyword
      zoneFirst: $zoneFirst
      zoneSecond: $zoneSecond
      page: $page
    ) {
      posts {
        ...PostFragment
      }
      totalResults
    }
  }
  ${POST_FRAGMENT}
`;

function Search() {
  const onValid: SubmitHandler<searchPostVariables> = ({
    zoneFirst,
    zoneSecond,
  }) => {
    setPage(1);
    refetch({
      keyword,
      zoneFirst: +zoneFirst,
      zoneSecond: +zoneSecond,
      page: 1,
    });
  };

  const onPageChanged = () => {
    const { zoneFirst, zoneSecond } = getValues();
    if (zoneFirst && zoneSecond) {
      refetch({
        keyword,
        zoneFirst: +zoneFirst,
        zoneSecond: +zoneSecond,
        page,
      });
    }
  };

  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get('keyword');
  const meData = GetMeUser();
  const { register, handleSubmit, getValues } = useForm<searchPostVariables>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { data, loading, refetch } = useQuery<searchPost>(SEARCH_POST_QUERY, {
    variables: {
      keyword,
      zoneFirst: meData?.me?.zoneId ? +meData.me.zoneId.slice(0, -2) : 0,
      zoneSecond: meData?.me?.zoneId ? +meData.me.zoneId.slice(-2) : 0,
    },
    refetchWritePolicy: 'overwrite',
    onCompleted: (data) => {
      const { totalResults } = data.searchPost;
      setTotalPage(Math.ceil(totalResults / PER_PAGE));
    },
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
            handleSubmit={handleSubmit(onValid)}
            loading={loading}
          />

          {!!data?.searchPost.posts && (
            <Grid keyword={keyword ?? ''} posts={data.searchPost.posts} />
          )}

          {!!data?.searchPost.totalResults && (
            <Pagination page={page} totalPage={totalPage} setPage={setPage} />
          )}
        </>
      )}
    </PostsWrapper>
  );
}

export default Search;
