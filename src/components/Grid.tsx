import styled from 'styled-components';
import { seePosts_seePosts_posts } from '../__generated__/seePosts';
import ItemBanner from './ItemBanner';

const Keyword = styled.span``;
const Wrapper = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  ${Keyword} {
    font-weight: 600;
  }
`;

interface IProps {
  posts: (seePosts_seePosts_posts | null)[];
  keyword?: string;
}

function Grid({ posts, keyword }: IProps) {
  return (
    <Wrapper>
      {posts.length === 0 ? (
        <div>no result for {!!keyword && <Keyword>{keyword}</Keyword>}</div>
      ) : (
        posts.map((post) =>
          post ? <ItemBanner {...post} key={post.id} /> : null
        )
      )}
    </Wrapper>
  );
}
export default Grid;
