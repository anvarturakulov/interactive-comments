import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIdToNewComment, getArrayId } from '../../services/getIdToNewComment';
import getComment from '../../services/getComment';
import getData from '../../services/getData';
import Comment from '../comment/comment';
import CommentAddForm from '../comment-add-form/comment-add-form';

const Container = styled.div`
  max-width: 640px;
  /* width: 100%; */
  padding: 0px 20px;
  margin: 0 auto;
  @media (max-width:576px){
    padding: 0px 10px;
  }

  .wrapper{
    position: absolute;
    z-index: 1;
    background-color: rgba(0,0,0,0.5);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .box{
    width: 300px;
    margin: 0 auto;
    position: fixed;
    top: 150px;
    left: 40%;
    background-color: #fff;
    padding: 25px;
    color: #68727e;
    font-size: 16px;
    border-radius: 10px;
    @media (max-width:680px){
      left: 2%;
      padding: 10px;
      font-size: 14px;
    }
    .title{
      font-size: 25px;
      margin-bottom: 10px;
      font-weight: 700;
      @media (max-width:680px){
        font-size: 20px;
      }
    }

    .content{
      margin-bottom: 15px;
    }

    .btn-box{
      display: flex;
      justify-content: space-between;
      /* @media (max-width:680px){
        justify-content: space-around;
      } */
    }

    .btn{
      background-color:#68727e;
      border: none;
      padding: 10px 15px;
      font-size: 16px;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      @media (max-width:680px){
        font-size: 14px;
        padding: 10px 20px;
      }
    }

    .btn-red{
      background-color:#ee6368;
    }
  }
`;


function App() {

  const [data, setData] = useState(getData())
  const [flagsOpenedReplyForms, setFlagsOpenedReplyForms] = useState(null)
  const [showDeleteWindow, setShowDeleteWindow] = useState(false)
  const [idDeleteComment, setIdDeleteComment] = useState()

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

  const deleteComment = (id, resolution = false) => {

    if (resolution) {
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

      setShowDeleteWindow(false)

    } else {
      setIdDeleteComment(id)
      setShowDeleteWindow(true)
    }
  }

  const onKeyPress = (e) => {
    if (e.keyCode === 13) {
      if (e.target.nodeName == 'TEXTAREA') {
        let target = e.target.parentNode.querySelector('button').click()
        console.log(target)
      }
    }
  }

  const wrapperBoxClick = (e) => {
    if (e.target.classList.contains('wrapper')) {
      setShowDeleteWindow(false)
    }
  }

  const wrapperBoxKeyPress = (e) => {
    if (e.keyCode === 27) {
      setShowDeleteWindow(false)
    }
  }

  const deleteWindow = (
    <div className="wrapper" onClick={wrapperBoxClick} onKeyDown={wrapperBoxKeyPress}>
      <div className="box">
        <div className="title">Delete comment</div>
        <div className="content">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</div>
        <div className="btn-box">
          <button className="btn" tabIndex={0} onClick={() => setShowDeleteWindow(false)}>NO, CANCEL</button>
          <button className="btn btn-red" onClick={() => deleteComment(idDeleteComment, true)}>YES, DELETE</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="App" onKeyDown={onKeyPress}>
      <Container>
        {showDeleteWindow ? deleteWindow : null}
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
