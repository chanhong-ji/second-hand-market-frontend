import { gql, useQuery, useReactiveVar } from '@apollo/client';
import styled from 'styled-components';
import { zoneIdVar } from '../apollo';
import ItemBanner from '../components/ItemBanner';
import { POST_FRAGMENT } from '../fragment';
import { seePosts } from '../__generated__/seePosts';

const Title = styled.div``;
const Grid = styled.div``;
const Wrapper = styled.div`
  background-color: ${(p) => p.theme.color.bg.main};
  padding-top: 20px;
  border: 1px solid ${(p) => p.theme.color.border};
  border-radius: 10px;
  margin-top: 40px;
  width: 100%;
  min-height: 300px;
  ${Title} {
    font-size: 17px;
    font-weight: 600;
    margin-left: 30px;
  }
  ${Grid} {
    padding: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 30px;
  }
`;

const SEE_POSTS_QUERY = gql`
  query seePosts($zoneId: Int!, $categoryId: Int, $page: Int) {
    seePosts(zoneId: $zoneId, categoryId: $categoryId, page: $page) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

function Home() {
  const userZoneId = useReactiveVar(zoneIdVar);
  const { data, loading } = useQuery<seePosts>(SEE_POSTS_QUERY, {
    variables: { zoneId: userZoneId ? +userZoneId : 0 },
  });

  return (
    <Wrapper>
      <Title>중고거래</Title>
      <Grid>
        {data?.seePosts?.map((post) =>
          post ? (
            <ItemBanner
              id={post.id}
              title={post.title}
              photos={post.photos}
              dealt={post.dealt}
              interestsCount={post.interestsCount}
              zone={post.zone}
              key={post.id + ''}
            />
          ) : null
        )}
      </Grid>
    </Wrapper>
  );
}

export default Home;
