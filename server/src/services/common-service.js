import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class CommonService {
  // token으로 권한이 무엇인지 확인하기.
  checkRole(token) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
      const jwtDecoded = jwt.verify(token, secretKey);
      const userRole = jwtDecoded.role;

      return userRole;
    } catch (error) {
      throw new Error("정상적인 토큰이 아닙니다.");
    }
  }

  // token으로 아이디(_id) 가져오기
  getDBIdWithToken(token) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
      const jwtDecoded = jwt.verify(token, secretKey);

      const userId = jwtDecoded.userId;

      return userId;
    } catch (error) {
      throw new Error("정상적인 토큰이 아닙니다.");
    }
  }

  // token으로 아이디 가져오기
  getIdWithToken(token) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
      const jwtDecoded = jwt.verify(token, secretKey);

      const userId = jwtDecoded.id;

      return userId;
    } catch (error) {
      throw new Error("정상적인 토큰이 아닙니다.");
    }
  }
}

const commonService = new CommonService();

export { commonService };
