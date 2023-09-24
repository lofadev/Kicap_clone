import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
import './ArticleTag.scss';

const ArticleTag = ({ newsState }) => {
  return (
    <div className='tag-article'>
      <span className='tag-head'>Tags: </span>
      {Object.keys(newsState).length !== 0 &&
        newsState.tags.map((item, index) => {
          return (
            <Link title={item} to={'/'} key={index} className='tag-link'>
              {item}
            </Link>
          );
        })}
    </div>
  );
};

ArticleTag.propTypes = {
  newsState: Proptypes.object.isRequired,
};
export default ArticleTag;
