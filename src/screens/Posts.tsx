import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { zoneIdVar } from '../apollo';
import ItemBanner from '../components/ItemBanner';
import Loader from '../components/Loader';
import Pagination from '../components/Pagenation';
import ZoneBlock from '../components/ZoneBlock';
import { categoryList } from '../dataList';
import { POST_FRAGMENT } from '../fragment';
import { getZoneId } from '../utils';
import { seePosts, seePostsVariables } from '../__generated__/seePosts';

const Top = styled.div``;
const Title = styled.div``;
const Options = styled.form``;
const OptionBtn = styled.button``;
const Category = styled.div``;
const Grid = styled.div``;

const Wrapper = styled.div`
  background-color: ${(p) => p.theme.color.bg.main};
  border: 1px solid ${(p) => p.theme.color.border};
  border-radius: 10px;
  margin-top: 40px;
  width: 100%;
  min-height: 300px;
  position: relative;
  padding-bottom: 60px;
  ${Top} {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${Title} {
      font-size: 17px;
      font-weight: 600;
      margin-left: 30px;
    }
    ${Options} {
      label {
        font-size: 15px;
        color: grey;
        font-weight: 600;
        margin-right: 5px;
      }
      select {
        border: none;
        outline: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      }
      ${Category} {
        width: 100%;
        display: flex;
        align-items: center;
      }
      ${OptionBtn} {
        padding: 5px;
        border-radius: 5px;
      }
    }
  }
  ${Grid} {
    padding: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 30px;
  }
`;

const SEE_POSTS_QUERY = gql`
  query seePosts($zoneId: Int!, $categoryName: String, $page: Int) {
    seePosts(zoneId: $zoneId, categoryName: $categoryName, page: $page) {
      posts {
        ...PostFragment
      }
      totalResults
    }
  }
  ${POST_FRAGMENT}
`;

interface IForm {
  first: string;
  second: string;
}

function Posts() {
  const onInValid = ({ first, second }: any) => {
    if (first?.message) {
      alert(first.message);
      return;
    }
    if (second?.message) {
      alert(second.message);
      return;
    }
  };

  const onValid: SubmitHandler<seePostsVariables & IForm> = ({
    categoryName,
    first,
    second,
  }) => {
    setCategoryName(categoryName ?? 'all');
    setZoneId(getZoneId(first, second));
  };

  const userZoneId = useReactiveVar(zoneIdVar);
  const { register, handleSubmit } = useForm<seePostsVariables & IForm>();
  const [page, setPage] = useState(1);
  const [curPages, setCurPages] = useState<number[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [zoneId, setZoneId] = useState(0);
  const [categoryName, setCategoryName] = useState('all');
  const PER_PAGE = 12;
  const { data, loading, refetch } = useQuery<seePosts>(SEE_POSTS_QUERY, {
    variables: { zoneId: userZoneId ? +userZoneId : 0 },
    refetchWritePolicy: 'overwrite',
  });

  useEffect(() => {
    if (data?.seePosts.totalResults) {
      setTotalPage(Math.ceil(data.seePosts.totalResults / PER_PAGE));
    }
  }, [data?.seePosts.totalResults]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (data?.seePosts.totalResults) {
      const stand = Math.floor((page - 1) / 10);
      const paginationArray = Array.from(Array(10).keys())
        .map((i) => stand * 10 + i + 1)
        .filter((i) => i <= Math.ceil(data.seePosts.totalResults / PER_PAGE));
      setCurPages(paginationArray);
    }
  }, [Math.floor((page - 1) / 10), data]);

  useEffect(() => {
    refetch({
      zoneId,
      categoryName: categoryName === 'all' ? undefined : categoryName,
      page,
    });
  }, [page]);

  useEffect(() => {
    setPage(1);
    refetch({
      zoneId,
      categoryName: categoryName === 'all' ? undefined : categoryName,
      page: 1,
    });
  }, [zoneId, categoryName]);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Top>
            <Title>중고거래</Title>
            <Options onSubmit={handleSubmit(onValid, onInValid)}>
              <ZoneBlock register={register}>
                <label htmlFor='zone'>Zone</label>
              </ZoneBlock>
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
              <OptionBtn
                disabled={loading}
                onClick={handleSubmit(onValid, onInValid)}
              >
                검색
              </OptionBtn>
            </Options>
          </Top>

          <Grid>
            {data?.seePosts?.posts?.length === 0 ? (
              <div>no result</div>
            ) : (
              data?.seePosts?.posts?.map((post) =>
                post ? (
                  <ItemBanner
                    id={post.id}
                    title={post.title}
                    photos={post.photos}
                    price={post.price}
                    dealt={post.dealt}
                    interestsCount={post.interestsCount}
                    zone={post.zone}
                    key={post.id + ''}
                  />
                ) : null
              )
            )}
          </Grid>

          {!!data?.seePosts.totalResults && (
            <Pagination
              page={page}
              curPages={curPages}
              totalPage={totalPage}
              setPage={setPage}
            />
          )}

          <Outlet />
        </>
      )}
    </Wrapper>
  );
}

export default Posts;
