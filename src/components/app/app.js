import { useEffect, useState } from 'react';
import styled from 'styled-components';
import getIdToNewComment from '../../services/getIdToNewComment';
import getComment from '../../services/getComment';
import getData from '../../services/getData';

import CommentsList from '../comments-list/comments-list';
import CommentAddForm from '../comment-add-form/comment-add-form';

const Container = styled.div`
  max-width: 640px;
  padding: 0px 20px;
  margin: 0 auto;
`;


function App() {

  const [data, setData] = useState(getData())

  useEffect(() => {
    let dataForStorage = JSON.stringify(data)
    localStorage.setItem('data', dataForStorage);
  }, [data])

  console.log(getComment(data.comments, 'id', '2'))

  const addCommentReply = (textComment, reply, replyToId) => {
    let currentDate = "1 month ago"
    let newComment = {
      "id": getIdToNewComment(data.comments),
      "content": textComment,
      "createdAt": currentDate,
      "score": 0,
      "user": {
        "image": {
          "png": data.currentUser.image.png,
          "webp": data.currentUser.image.webp
        },
        "username": data.currentUser.username
      },
      "replies": []
    }

    if (!reply) {
      let commentsList = [...data.comments, newComment]
      setData(data => ({
        ...data,
        comments: commentsList
      }))
    } else {
      console.log('reply to ID', replyToId)
    }
  }


  return (
    <div className="App">
      <Container>
        <CommentsList comments={data.comments} currentUser={data.currentUser} addCommentReply={addCommentReply} />
        <CommentAddForm currentUser={data.currentUser} addCommentReply={addCommentReply} />
      </Container>
    </div>
  );
}

export default App;
