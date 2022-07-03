import styled from 'styled-components';
import { seePosts_seePosts_posts } from '../__generated__/seePosts';
import ItemBanner from './ItemBanner';

const Wrapper = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 30px;
`;

interface IProps {
  posts: (seePosts_seePosts_posts | null)[];
  keyword?: string;
}

function Grid({ posts, keyword }: IProps) {
  return (
    <Wrapper>
      {posts.length === 0 ? (
        <div>no result {keyword ?? <span> {keyword}</span>}</div>
      ) : (
        posts.map((post) =>
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
              roomCount={post.roomCount}
            />
          ) : null
        )
      )}
    </Wrapper>
  );
}
export default Grid;
