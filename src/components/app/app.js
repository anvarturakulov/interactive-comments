import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIdToNewComment, getArrayId } from '../../services/getIdToNewComment';
import getComment from '../../services/getComment';
import getData from '../../services/getData';
import Comment from '../comment/comment';
import CommentAddForm from '../comment-add-form/comment-add-form';

const Container = styled.div`
  max-width: 640px;
  padding: 0px 20px;
  margin: 0 auto;
  @media (max-width:576px){
    padding: 0px 10px;
  }
`;


function App() {

  const [data, setData] = useState(getData())
  const [flagsOpenedReplyForms, setFlagsOpenedReplyForms] = useState(null)
  let _ = require('lodash');

  useEffect(() => {
    let dataForStorage = JSON.stringify(data)
    localStorage.setItem('data', dataForStorage);
  }, [data])

  useEffect(() => {
    let arrayId = getArrayId(data.comments)
    let newObj = {}
    arrayId.forEach(item => newObj[item] = false)
    setFlagsOpenedReplyForms(newObj)
  }, [])

  const toggleFlagOpenedReplyForm = (id) => {
    let newObj = { ...flagsOpenedReplyForms }
    for (let key in newObj) {
      newObj[key] = false
    }
    setFlagsOpenedReplyForms(newObj)
  }

  const defaultDataForNewComment = (textComment, values) => {
    let currentDate = "today"
    return {
      "id": getIdToNewComment(values.comments),
      "content": textComment,
      "createdAt": currentDate,
      "score": 0,
      "user": {
        "image": {
          "png": values.currentUser.image.png,
          "webp": values.currentUser.image.webp
        },
        "username": values.currentUser.username
      },
      "replies": []
    }
  }

  const addCommentReply = (textComment, reply, replyToId) => {
    let newComment = defaultDataForNewComment(textComment, data)

    if (reply == 'REPLY') {
      console.log('reply to ID', replyToId)
      const { paths } = getComment(data.comments, 'id', replyToId)
      let newComments = [...data.comments]
      let newReply = defaultDataForNewComment(textComment, data)
      let arrayReplies = _.get(newComments, `${paths}.replies`)
      let number = arrayReplies == undefined ? 0 : arrayReplies.length
      if (arrayReplies == undefined) {
        _.set(newComments, `${paths}.replies.[0]`, newReply);
      } else {
        arrayReplies = [newReply, ...arrayReplies]
        _.set(newComments, `${paths}.replies`, arrayReplies);
      }
      setData(data => ({
        ...data,
        comments: newComments
      }))
      toggleFlagOpenedReplyForm(replyToId)

    } else if (reply == 'EDIT') {

      console.log('edit to ID', replyToId)
      const { paths } = getComment(data.comments, 'id', replyToId)
      let newComments = [...data.comments]
      _.set(newComments, `${paths}.content`, textComment);

      setData(data => ({
        ...data,
        comments: newComments
      }))
      toggleFlagOpenedReplyForm(replyToId)

    } else {
      let commentsList = [...data.comments, newComment]
      setData(data => ({
        ...data,
        comments: commentsList
      }))
    }

  }

  const incDecScore = (id, count) => {
    console.log('score to ID', id)
    const { paths } = getComment(data.comments, 'id', id)
    let newComments = [...data.comments]


    let score = parseInt(_.get(newComments, `${paths}.score`), 10)
    score = score + count
    if (score > -1) {
      _.set(newComments, `${paths}.score`, score);
      setData(data => ({
        ...data,
        comments: newComments
      }))
    }

  }

  const deleteComment = (id) => {
    const { paths } = getComment(data.comments, 'id', id)
    let newComments = [...data.comments]
    let arrayComments = paths.split('.')

    let arr = arrayComments[arrayComments.length - 1].split('')
    let parentPath = arrayComments.slice(0, arrayComments.length - 1).join('.')
    let index = arr.slice(1, arr.length - 1).join('')

    if (parentPath.length > 0) {
      let arrParentPath = _.get(newComments, `${parentPath}`)
      let arrParentPathSliced = [...arrParentPath.slice(0, index), ...arrParentPath.slice(index + 1)]
      _.set(newComments, `${parentPath}`, arrParentPathSliced);
    } else {
      newComments = [...newComments.slice(0, index), ...newComments.slice(+index + 1, newComments.length)]
    }

    setData(data => ({
      ...data,
      comments: newComments
    }))
  }


  // document.getElementById("text")
  //   .addEventListener("keyup", function (e) {
  //     if (e.keyCode === 13) {
  //       document.getElementById("submit").click();
  //     }
  //   })

  return (
    <div className="App">
      <Container>
        {data.comments.map((item, index) => {
          return <Comment
            item={item}
            key={item.id}
            currentUser={data.currentUser}
            addCommentReply={addCommentReply}
            flagsOpenedReplyForms={flagsOpenedReplyForms}
            incDecScore={incDecScore}
            comments={data.comments}
            deleteComment={deleteComment} />
        })}
        <CommentAddForm
          currentUser={data.currentUser}
          addCommentReply={addCommentReply}
          reply=''
          replyToName=''
          replyToId=''
          comments={data.comments} />
      </Container>
    </div>
  );
}

export default App;
