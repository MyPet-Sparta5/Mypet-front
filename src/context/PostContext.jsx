// 실제로 연동되면 사라질 파일입니다! PostList에 연동해서 값 가져와야할거에요! - 따라서 App.js도 건드셔야함..
import React, { createContext } from 'react';

export const PostContext = createContext();

const PostProvider = ({ children }) => {
    // Sample data 
    const posts = [
        { id: 1, category: "자랑하기", title: "햄스터 귀엽죠? ^^", content: "제가 키우는 선우칠갑이 입니다~ ^^\n20년같은 3개월 됐어요~", nickname: "test", createdTime: "2024-07-20", likes: 1, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 2, category: "자유게시판", title: "우리집 햄스터랑 맞짱떴는데 졌다", content: "아니.. 왤캐 세냐\n오늘 피봤다 ㅠ", nickname: "도라미", createdTime: "2024-07-21", likes: 20, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 3, category: "자랑하기", title: "세 번째 게시물", content: "내용 3", nickname: "test", createdTime: "2024-07-22", likes: 30, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 4, category: "자랑하기", title: "네 번째 게시물", content: "내용 4", nickname: "test", createdTime: "2024-07-23", likes: 40, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 5, category: "자유게시판", title: "다섯 번째 게시물", content: "내용 5", nickname: "test", createdTime: "2024-07-24", likes: 50, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 6, category: "자랑하기", title: "여섯 번째 게시물", content: "내용 6", nickname: "test", createdTime: "2024-07-25", likes: 60, fileUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PhodopusSungorus_2.jpg/640px-PhodopusSungorus_2.jpg" },
        { id: 7, category: "자랑하기", title: "7번째 게시물", content: "내용 7", nickname: "test", createdTime: "2024-07-23", likes: 40 },
        { id: 8, category: "자유게시판", title: "8번째 게시물", content: "내용 8", nickname: "test", createdTime: "2024-07-24", likes: 50 },
        { id: 9, category: "자랑하기", title: "9번째 게시물", content: "내용 9", nickname: "test", createdTime: "2024-07-25", likes: 60 },
        { id: 10, category: "자랑하기", title: "10번째 게시물", content: "내용 10", nickname: "test", createdTime: "2024-07-23", likes: 40 },
        { id: 11, category: "자유게시판", title: "11번째 게시물", content: "내용 11", nickname: "test", createdTime: "2024-07-24", likes: 50 },
        { id: 12, category: "자랑하기", title: "12번째 게시물", content: "내용 12", nickname: "test", createdTime: "2024-07-25", likes: 60 }
    ];

    return (
        <PostContext.Provider value={posts}>
            {children}
        </PostContext.Provider>
    );
};

export default PostProvider;
