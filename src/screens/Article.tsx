import { gql, useQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfoBlock from '../components/InfoBlock';
import OwnerBlock from '../components/OwnerBlock';
import PhotoBlock from '../components/PhotoBlock';
import { POST_FRAGMENT } from '../fragment';
import { seePost } from '../__generated__/seePost';
import NotFound from './NotFound';

const Wrapper = styled.div`
  width: 80%;
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

function Article() {
  const { id } = useParams();
  const { data, loading } = useQuery<seePost>(SEE_POST_QUERY, {
    skip: !!!id || !!!/^\d+$/.test(id),
    variables: { id: id ? +id : 0 },
  });

  return (
    <Wrapper>
      {id ? (
        id && !/^\d+$/.test(id) ? (
          <Navigate to='/' replace />
        ) : loading ? (
          <div>loading....</div>
        ) : data?.seePost ? (
          <>
            <PhotoBlock photos={data.seePost.photos} />
            <OwnerBlock
              postId={+id}
              user={data.seePost.user}
              zone={data.seePost.zone}
              interestsCount={data.seePost.interestsCount}
              isInterest={data.seePost.isInterest}
              isMine={data.seePost.isMine}
            />
            <InfoBlock
              title={data.seePost.title}
              caption={data.seePost.caption}
              category={data.seePost.category}
            />
          </>
        ) : (
          <NotFound />
        )
      ) : null}
    </Wrapper>
  );
}
export default Article;
