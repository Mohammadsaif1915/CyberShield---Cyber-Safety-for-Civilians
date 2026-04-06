import React from 'react';
import { useParams } from 'react-router-dom';
import BlogPost from './Blogpost';

// This page reads :id from the URL and passes it to BlogPost
const BlogPostPage = () => {
  const { id } = useParams();
  return <BlogPost postId={id} />;
};

export default BlogPostPage;