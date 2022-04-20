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
    // eslint-disable-next-line
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [isHelpful, setIsHelpful] = useState(null);
    const [comment, setComment] = useState('');


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
        const newPost = {
            "wasHelpful": isHelpful,
            "comment": comment,
        }
        const { data } = await Api.post("/feedback", newPost);
        console.log(data);
        sessionStorage.setItem('id', data.id);
        return data;
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
        }
        const { data } = await Api.put(`/feedback/${id}`, newPost)
        return data;
    }

    // DELETE /feedback/:id
    // eslint-disable-next-line
    const deleteFeedback = async (id) => {
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
        }
        else {
            setLikeIcon(`${LikeUnelected}`)
            setDislikeIcon(`${DislikeSelected}`)
            setIsHelpful(false)
        }
    }

    const handleLikeClick = async (e) => {
        await setConditions(e);
    }

    const handleSubmit = async (e) => {
        const ID = sessionStorage.getItem("id")
        if (!ID) {
            const res = createNewFeedback()
            console.log(res)
        }
        else {
            updateFeedback(ID)
        }
    }

    const handleInputChange = (e) => {
        console.log(e.target.value);
        setComment(e.target.value);
    }

    useEffect(() => {
        console.log(comment)
    }, [isClicked, isHelpful, comment]);


    // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="main-container">
            <div className="feedback-widget">
                <h2 className="feedback-title">Is this page helpful?</h2>
                <div className="buttons-container">
                    <button onClick={(e) => handleLikeClick(e)} className="btn yes">
                        <img alt={"img"} className="icon like-icon" src={likeIcon}></img>
                        Yes
                    </button>
                    <button onClick={handleLikeClick} className="btn no">
                        <img alt={"img"} className="icon dislike-icon" src={dislikeIcon}></img>
                        No
                    </button>
                </div>
                {isClicked && <Form handleInputChange={(e) => handleInputChange(e)} comment={comment} handleSubmit={() => handleSubmit()} />}
            </div>
        </div>
    )
}

export default FeedbackWidget