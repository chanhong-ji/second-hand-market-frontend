import { gql, useQuery } from '@apollo/client';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfoBlock from '../components/InfoBlock';
import OwnerBlock from '../components/OwnerBlock';
import PhotoBlock from '../components/PhotoBlock';
import { POST_FRAGMENT } from '../fragment';
import { seePost } from '../__generated__/seePost';
import NotFound from './NotFound';

const Wrapper = styled.div`
  width: 80%;
  min-width: 500px;
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
    skip: !!!id || !!!/^\d+$/.test(id),
    variables: { id: id ? +id : 0 },
  });

  return (
    <Wrapper>
      <Outlet />
      {id ? (
        id && !/^\d+$/.test(id) ? (
          <Navigate to='/' replace />
        ) : loading ? (
          <div>loading....</div>
        ) : data?.seePost ? (
          <>
            <PhotoBlock
              photos={data.seePost.photos}
              isDealt={data.seePost.dealt}
            />
            <OwnerBlock
              postId={+id}
              user={data.seePost.user}
              zone={data.seePost.zone}
              interestsCount={data.seePost.interestsCount}
              isInterest={data.seePost.isInterest}
              isMine={data.seePost.isMine}
              dealt={data.seePost.dealt}
            />
            <InfoBlock
              postId={data.seePost.id}
              title={data.seePost.title}
              caption={data.seePost.caption}
              category={data.seePost.category}
              photos={data.seePost.photos}
              price={data.seePost.price}
              categoryName={data.seePost.category.name}
              isMine={data.seePost.isMine}
              isDealt={data.seePost.dealt}
            />
          </>
        ) : (
          <NotFound />
        )
      ) : null}
    </Wrapper>
  );
}
export default Post;
