import React, { useEffect, useState } from 'react'
import "./Form.css";


const Form = ({ handleInputChange, comment, handleSubmit }) => {

  const [isClicked, setIsClicked] = useState(true);

  const handleSubmitForm = (e) => {
    e.preventDefault("");

    const res = handleSubmit()
    console.log(comment);
    // setIsClicked(!isClicked);
    console.log(res);
  }

  useEffect(() => {
  }, [comment]);


  return (
    isClicked && <form className="form" onSubmit={handleSubmitForm}>
      <textarea type="text" className="input" placeholder="Any additional feedback?" onChange={(e) => handleInputChange(e)} value={comment}></textarea>
      <div className="btns-container">
        <button className="form-btn skip">Skip</button>
        <button onSubmit={(e) => handleSubmitForm(e)} className="form-btn submit">Submit</button>
      </div>
    </form>
  )
}

export default Form
