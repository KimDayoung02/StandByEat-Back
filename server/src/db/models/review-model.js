import { model } from "mongoose";
import { ReviewSchema } from "../schemas/review-schema";

const Review = model("reviews", ReviewSchema);

export class ReviewModel {
  // 리뷰 스키마 생성한다(리뷰가입)
  async create(userInfo) {
    // user 모델과 동일
    const review = await Review.create(userInfo);
    return review;
  }

  // filter내용으로 리뷰 조회한다. (리뷰 조회)
  async findById(filter) {
    // user모델과 동일
    const review = await Review.findOne(filter);
    return review;
  }

  // 리뷰 정보를 수정한다.(리뷰정보 수정)
  async updateReviewInfo(filter, update) {
    // user모델과 동일
    const review = await Review.findOneAndUpdate(filter, update, { new: true });
    return review;
  }

  // 리뷰 정보를 삭제한다.
  async delete(filter) {
    // filter : 데이터를 찾을 조건
    // json화한 값이어야 한다. ex) {name:"elice"}
    const review = await Review.deleteOne(filter);
    // filter에 맞는 데이터를 삭제한다.
    // user에는 삭제한 값의 갯수를 저장한다.
    // 성공한다면 1이 될것임.
    return review;
    // 성공한 값의 갯수를 전달.
  }

  // 리뷰 정보를 가져온다.(모든 리뷰 정보 가져오기)
  async findAll(filter) {
    // filter(조건)에 따른 모든 정보를 가져온다.
    const reviews = await Review.find(filter);
    return reviews;
  }
}

const reviewModel = new ReviewModel();

export { reviewModel };
