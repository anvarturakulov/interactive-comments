import styled from "styled-components";

const AddForm = styled.div`
    margin: 10px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    font-size: 16px;

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

`

const CommentAddForm = ({ currentUser, reply, replyTo }) => {
  return (
    <AddForm>
      <img src={currentUser.image.png} alt="" />
      <textarea name="add-form-text" id="" cols="30" rows="5" placeholder="Add a comment ..." defaultValue={replyTo ? `@${replyTo}, ` : null} />
      <button className="add-form-btn">{reply ? 'REPLY' : 'SEND'}</button>
    </AddForm>
  )
}

export default CommentAddForm