import { gql, useQuery } from '@apollo/client';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfoBlock from '../components/InfoBlock';
import Loader from '../components/Loader';
import OwnerBlock from '../components/OwnerBlock';
import PageTitle from '../components/PageTitle';
import PhotoBlock from '../components/PhotoBlock';
import { POST_FRAGMENT } from '../fragment';
import { seePost } from '../__generated__/seePost';
import NotFound from './NotFound';

const Wrapper = styled.div`
  width: 90%;
  max-width: 700px;
  margin: 30px auto;
`;

const SEE_POST_QUERY = gql`
  query seePost($id: Int!) {
    seePost(id: $id) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

function Post() {
  const { id } = useParams();
  const { data, loading } = useQuery<seePost>(SEE_POST_QUERY, {
    skip: !id || !/^\d+$/.test(id),
    variables: { id: id ? +id : 0 },
  });

  return (
    <Wrapper>
      <PageTitle title='Post' />
      <Outlet />
      {!!!id || !/^\d+$/.test(id) ? (
        <NotFound />
      ) : loading ? (
        <Loader />
      ) : data?.seePost ? (
        <>
          <PhotoBlock
            photos={data.seePost.photos}
            isDealt={data.seePost.dealt}
          />
          <OwnerBlock {...data.seePost} />
          <InfoBlock {...data.seePost} />
        </>
      ) : (
        <NotFound />
      )}
    </Wrapper>
  );
}
export default Post;
