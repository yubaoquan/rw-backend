module.exports = (noNeedLogin) => async (ctx, next) => {
  const token = ctx.headers.authorization?.replace(/^Bearer /, '');

  if (!token) {
    if (noNeedLogin) return next();
    ctx.throw(401);
  }

  try {
    const data = await ctx.service.user.verifyToken(token);
    const user = await ctx.service.user.findById(data.userId);
    ctx.user = { ...user.toJSON(), token };
  } catch (e) {
    console.error(e);
    ctx.throw(401);
  }

  await next();
};
