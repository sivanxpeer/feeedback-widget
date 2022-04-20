import React, { useEffect, useState } from 'react';
import "./FeedbackWidget.css";
// import Like from "../../assets/like.png"
import Like from "../../assets/like.svg";
import LikeSelected from "../../assets/likeSelected.svg";
import LikeUnelected from "../../assets/likeUnselected.svg";
import Dislike from "../../assets/dislike.svg"
import DislikeSelected from "../../assets/dislikeSelected.svg"
import DislikeUnelected from "../../assets/dislikeUnselected.svg"
import Form from '../form/Form';
import "../form/Form.css";

import Api from '../../api/mockapi';

const FeedbackWidget = () => {

    const [likeIcon, setLikeIcon] = useState(`${Like}`);
    const [dislikeIcon, setDislikeIcon] = useState(`${Dislike}`);
    const [isClicked, setIsClicked] = useState(false);

    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [isHelpful, setIsHelpful] = useState(null);
    const [comment, setComment] = useState('');
    const [postId, setPostId] = useState('');


    // GET /feedback
    const getFeedbackData = async () => {
        const { data } = await Api.get("/feedback");
        console.log(data);
        setAllFeedbacks(data);
        return data;
    }

    // GET /feedback/:id
    const getFeedbackById = async (id) => {
        const { data } = await Api.get(`/feedback/${id}`);
        console.log(data);
        return data;
    }

    // POST /feedback
    const createNewFeedback = async () => {
        // const today = new Date();

        const newPost = {
            "wasHelpful": isHelpful,
            "comment": comment,
            // "createdAt": today.toISOString(),
            // "id": allFeedbacks.length + 1,
        }
        const { data } = await Api.post("/feedback", newPost);
        console.log(data);
        const id = data.id;
        setPostId(id);
        sessionStorage.setItem('id', data.id);

        return data;
        // console.log(e);
    }


    // PUT /feedback/:id
    const updateFeedback = async (id) => {
        const feedback = await getFeedbackById(id);
        if (!feedback) {
            return "error"
        }
        const newPost = {
            "wasHelpful": isHelpful,
            "comment": comment,
            // "createdAt": today.toISOString(),
            // "id": id,
        }
        const { data } = await Api.put(`/feedback/${id}`, newPost)
        // setIsClicked(false);
        return data;
    }

    // DELETE /feedback/:id
    const deleteFeedback = async (id) => {
        // check if is exsits 
        const data = await getFeedbackData();
        console.log(data);
        const obj = data?.filter((dataObj) => `${dataObj.id}` === `${id}`)
        if (!obj || obj.length === 0) {
            console.log("objectnot foun")
            return "object not found";
        }
        else {
            const res = await Api.delete(`/feedback/${id}`);
            return res;
        }
    }

    const setConditions = async (e) => {
        setIsClicked(true);
        const btn = e.target.innerText;
        console.log(btn)
        if (btn === "Yes") {
            setLikeIcon(`${LikeSelected}`)
            setDislikeIcon(`${DislikeUnelected}`)
            setIsHelpful(true);
            sessionStorage.setItem('helpful', 'true');
            // setFeedback({"wasHelpful":true,"comment": comment})
        }
        else {
            setLikeIcon(`${LikeUnelected}`)
            setDislikeIcon(`${DislikeSelected}`)
            setIsHelpful(false)
            // setFeedback({"wasHelpful":false,"comment": comment})
        }
    }

    const handleLikeClick = async (e) => {
        await setConditions(e);
        // const post = await createNewFeedback();
        // console.log(post)
        // return post
    }

    const handleSubmit = async (e) => {
        // e.preventDefault();
        // console.log(comment);
        const ID=sessionStorage.getItem("id")
        if (!ID) {
            const res = createNewFeedback()
            console.log(res)
        }
        else {
            updateFeedback(ID)
        }
        // return res;
        // const update = updateFeedback(postId);
        // console.log(update);
    }

    const handleInputChange = (e) => {
        console.log(e.target.value);
        setComment(e.target.value);
    }

    useEffect(() => {
        // const res = getFeedbackData()

        // setFeedback({"wasHelpful":isHelpful,"comment": comment})
        // setAllFeedbacks(getFeedbackData())
        // console.log(post)
        // getFeedbackById(3);
        // const res = createNewFeedback()
        console.log(comment)
    }, [isClicked, isHelpful, comment]);
    
    
    // eslint-disable-line react-hooks/exhaustive-deps
        
    return (
        <div className="main-container">
            <div className="feedback-widget">
                <h2 className="feedback-title">Is this page helpful?</h2>
                <div className="buttons-container">
                    <button onClick={(e) => handleLikeClick(e)} className="btn yes">
                        <img className="icon like-icon" src={likeIcon}></img>
                        Yes
                    </button>
                    <button onClick={handleLikeClick} className="btn no">
                        <img className="icon dislike-icon" src={dislikeIcon}></img>
                        No
                    </button>
                </div>
                {isClicked && <Form handleInputChange={(e) => handleInputChange(e)} comment={comment} handleSubmit={() => handleSubmit()} />}

            </div>

        </div>
    )
}

export default FeedbackWidget