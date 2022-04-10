import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import Pagination from '../../components/post/Pagination';

const PaginationContainer = () => {
  const { username } = useParams();
  const { search } = useLocation();
  const { lastPage, posts, loading } = useSelector(({ posts, loading }) => ({
    lastPage: posts.lastPage,
    posts: posts.posts,
    loading: loading['posts/LIST_POSTS'],
  }));

  if (!posts || loading) return null;

  const { tag, page = 1 } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  return (
    <Pagination
      tag={tag}
      username={username}
      page={+page}
      lastPage={lastPage}
    />
  );
};

export default PaginationContainer;
