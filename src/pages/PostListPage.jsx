import React, { useEffect, useState } from 'react';
import PostList from '../components/PostList';

function PostListPage({ category }) {
    const [currentCategory, setCurrentCategory] = useState(category);

    useEffect(() => {
        setCurrentCategory(category);
    }, [category]);

    return (
        <div className="postList-page">
            <PostList category={currentCategory} />
        </div>
    );
}

export default PostListPage;