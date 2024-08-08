import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance, handleApiCall } from '../setting/api'; 
import styles from '../styles/PostList.module.css';
import PaginationButton from '../components/PaginationButton';

const MyPostList = () => {
  const navigate = useNavigate();
  const { email } = useParams(); // URL 파라미터에서 이메일을 추출합니다.
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nickname, setNickname] = useState('');
  const postsPerPage = 10;

  useEffect(() => {
    // 닉네임을 로컬 스토리지에서 가져오는 함수
    const fetchNickname = () => {
      const storedNickname = localStorage.getItem('nickname');
      setNickname(storedNickname || ''); // 기본값은 빈 문자열
    };

    // 게시글을 가져오는 함수
    const fetchPosts = async () => {
      try {
        const response = await handleApiCall(() => axiosInstance.get('/api/posts', {
          params: {
            page: currentPage,
            pageSize: postsPerPage,
            sortBy: 'createdAt,desc',
            userName: email, // 이메일을 userName 파라미터로 설정
          },
        }), navigate);

        const { content, totalPages } = response.data.data;
        setPosts(transformPostData(content));
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchNickname(); // 닉네임을 먼저 가져옴
    fetchPosts(); // 게시글을 가져옴
  }, [currentPage, email]); // 의존성 배열에서 email 추가

  const transformPostData = (data) => {
    const categoryMapping = {
      "BOAST": "자랑하기",
      "FREEDOM": "자유게시판"
    };

    return data.map(post => ({
      id: post.id,
      category: categoryMapping[post.category] || post.category,
      title: post.title,
      nickname: post.nickname,
      createdTime: new Date(post.createAt).toLocaleDateString(),
      likes: post.likeCount,
    }));
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const navigateToPost = (post) => {
    const targetPath = post.category === '자랑하기' ? `/pet/${post.id}` : `/posts/${post.id}`;
    navigate(targetPath);
  };

  const goToMyPage = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{nickname ? `${nickname}의 게시글 목록` : '게시글 목록'}</h2>
        <button onClick={goToMyPage} className={styles.button}>
          ← 마이페이지
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>제목</th>
            <th>좋아요 수</th>
            <th>작성자</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map(post => (
              <tr key={post.id} onClick={() => navigateToPost(post)} className={styles.clickableRow}>
                <td>{post.category}</td>
                <td>{post.title}</td>
                <td>{post.likes}</td>
                <td>{post.nickname}</td>
                <td>{post.createdTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">게시물이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationButton
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyPostList;
