import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Grid from '../components/Grid';
import Loader from '../components/Loader';
import Pagination from '../components/Pagenation';
import PostsTop from '../components/PostsTop';
import { PostsWrapper } from '../shared/shared';
import { categoryList } from '../dataList';
import { POST_FRAGMENT } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { seePosts, seePostsVariables } from '../__generated__/seePosts';
import { PER_PAGE } from '../shared/constant';

const Category = styled.div`
  label {
    display: block;
    margin-bottom: 7px;
    margin-top: 20px;
  }
  select {
    font-size: 19px;
    border: none;
    padding: 5px;
    box-shadow: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.1) 0px 0px 0px 1px;
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
        ...PostFragment
      }
      totalResults
    }
  }
  ${POST_FRAGMENT}
`;

function Posts() {
  const { register, handleSubmit, getValues } = useForm<seePostsVariables>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const meData = GetMeUser();
  const { data, loading, refetch } = useQuery<seePosts>(SEE_POSTS_QUERY, {
    variables: {
      zoneFirst: meData?.me?.zoneFirst ?? 0,
      zoneSecond: meData?.me?.zoneSecond ?? 0,
    },
    refetchWritePolicy: 'overwrite',
    onCompleted: (data) => {
      const { totalResults } = data.seePosts;
      setTotalPage(Math.ceil(totalResults / PER_PAGE));
    },
  });

  const onValid: SubmitHandler<seePostsVariables> = async ({
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

  useEffect(() => {
    const { zoneFirst, zoneSecond, categoryName } = getValues();
    if (zoneFirst && zoneSecond) {
      refetch({
        zoneFirst: +zoneFirst,
        zoneSecond: +zoneSecond,
        categoryName: categoryName === 'all' ? undefined : categoryName,
        page,
      });
    }
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
          >
            <Category>
              <label htmlFor='category'>Category</label>
              <select
                {...register('categoryName', { required: true })}
                id='category'
                defaultValue='all'
              >
                <option value='all' key='all'>
                  전체
                </option>
                {categoryList.map((cate, index) => (
                  <option value={cate} key={index + ''}>
                    {cate}
                  </option>
                ))}
              </select>
            </Category>
          </PostsTop>

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
