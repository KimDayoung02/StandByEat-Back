import { reviewModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class ReviewService {
  // 본 파일의 맨 아래에서, new ReviewService(reviewModel) 하면, 이 함수의 인자로 전달됨
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }
  
  // 리뷰 추가하기
  async addReview(reviewInfo){
    const review = await reviewModel.create(reviewInfo);
    return review;
  }
  
  // 리뷰 수정하기
  async setReview(reviewId,toUpdate){
    const idInfo = {_id:reviewId}
    const review = await reviewModel.updateReviewInfo(idInfo,toUpdate);
    return review; 
  }
  // 리뷰 삭제하기
  async deleteReview(reviewId){
    const review = await reviewModel.delete(reviewId);
    return review;
  }

}

const reviewService = new ReviewService(reviewModel);

export { reviewService };
