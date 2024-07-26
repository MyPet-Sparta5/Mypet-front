import React from 'react';
import PostList from '../components/PostList';

function PostListPage({ category }) {
    return (
        <div className="postList-page">
            <PostList category={category} />
        </div>
    );
}

export default PostListPage;