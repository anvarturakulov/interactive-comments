import styled from "styled-components";
import getComment from "../../services/getComment";

const AddForm = styled.div`
    margin: 10px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    font-size: 16px;

    @media (max-width:576px){
      display: block;
    }

    img{
      width: 40px;
      height: 40px;
    }

    textarea{
      border: 1px solid #000;
      ::placeholder{
        color: #797c81;
      }
      width: 100%;
      margin: 0px 20px;
      border: .5px solid #e5e5e5;
      padding: 10px 10px 10px 20px;
      @media (max-width:576px){
        width: 90%;
        margin: 0;
        max-width: 100%;
      }
    }

    button{
      background-color: hsl(238, 40%, 52%);
      border-radius: 10px;
      padding: 15px 30px;
      font-size: 19px;
      font-weight: 600;
      border: none;
      color: #fff;
      cursor: pointer;
    }

    .bottom-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

`

const CommentAddForm = ({ currentUser, reply, replyToName, replyToId, addCommentReply, comments }) => {
  let _ = require('lodash');

  const sendCommentReply = (e) => {
    let textArea = e.target.parentNode.parentNode.querySelector('textarea[name="add-form-text"]')
    let str = textArea.value
    str = str.replace(/@[a-z]*, /gi, "")
    if (str.length > 0) {
      addCommentReply(str, reply, replyToId)
      textArea.value = ''
    } else alert('Please enter comment text')

  }

  let defaultValue = ''

  let content = ''
  if (reply == 'EDIT') {
    const { paths } = getComment(comments, 'id', replyToId)
    content = _.get(comments, `${paths}.content`)
    defaultValue = content
  } else if (reply == 'REPLY') {
    defaultValue = replyToName ? `@${replyToName}, ` : null
  }

  let itsMobayl = false
  if (window.innerWidth < 576) itsMobayl = true

  return (
    <AddForm>
      {itsMobayl ?
        null :
        <img src={currentUser.image.png} alt="" />
      }
      <textarea name="add-form-text" id="" cols="30" rows="5" placeholder="Add a comment ..." defaultValue={defaultValue} />
      <div className="bottom-box">
        {!itsMobayl ?
          null :
          <img src={currentUser.image.png} alt="" />
        }
        <button
          className="add-form-btn"
          onClick={sendCommentReply}
        >{reply == 'REPLY' ? 'REPLY' : reply == 'EDIT' ? 'UPDATE' : 'SEND'}</button>
      </div>

    </AddForm>
  )
}

export default CommentAddForm