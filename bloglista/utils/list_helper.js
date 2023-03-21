var _ = require('lodash');
const blog = require('../models/blog');

const calculateNumberOfLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  return blogs
    .map((blog) => blog.likes)
    .reduce((total, current) => total + current, 0);
};

const mostLikedBlogPost = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce(
    (mostLiked, current) =>
      mostLiked.likes > current.likes ? mostLiked : current,
    blogs[0]
  );
};

const mostPopularBlogger = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = _.countBy(blogs, 'author');
  const answer = Object.entries(authors).reduce((acc, e) =>
    e[1] > acc[1] ? e : acc
  );

  return { author: answer[0], blogs: answer[1] };
};

const mostLikedBlogger = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorLikes = _.map(groupedByAuthor, (posts, author) => ({
    author,
    likes: _.sumBy(posts, 'likes'),
  }));

  return _.maxBy(authorLikes, 'likes');
};

module.exports = {
  calculateNumberOfLikes,
  mostLikedBlogPost,
  mostPopularBlogger,
  mostLikedBlogger,
};
