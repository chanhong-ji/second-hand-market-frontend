import styled from 'styled-components';
import { seePosts_seePosts_posts } from '../__generated__/seePosts';
import ItemBanner from './ItemBanner';

const Wrapper = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
          post ? <ItemBanner {...post} key={post.id} /> : null
        )
      )}
    </Wrapper>
  );
}
export default Grid;
