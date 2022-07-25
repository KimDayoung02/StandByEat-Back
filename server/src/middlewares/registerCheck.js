function registerCheck(req, res, next) {
  const { name, pw } = req.body;

  if (!name) {
    return res.status(403).json({
      result: "name-required",
      reason: "이름을 입력하지 않았습니다.",
    });
  }

  if (pw.length < 4) {
    return res.status(403).json({
      result: "pw-min-4",
      reason: "비밀번호는 4자리 이상이여야 합니다.",
    });
  }

  next();
}

export { registerCheck };
