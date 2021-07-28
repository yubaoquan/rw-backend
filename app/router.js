/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const {
    user: userCtrl,
    profile: profileCtrl,
    article: articleCtrl,
    comment: commentCtrl,
    tag: tagCtrl,
  } = app.controller;

  // 强制登录
  const auth = app.middleware.auth();

  // 如果登录, 就获取用户信息; 不登录也不报错
  const looseAuth = app.middleware.auth(true);

  const { router } = app;

  router.prefix('/api');

  // Users
  router.post('/users/login', userCtrl.login);
  router.post('/users', userCtrl.register);
  router.get('/user', auth, userCtrl.getCurrentUser);
  router.put('/user', auth, userCtrl.updateUser);

  // Profile
  router.get('/profiles/:username', looseAuth, profileCtrl.getProfile);
  router.post('/profiles/:username/follow', auth, profileCtrl.followUser);
  router.delete('/profiles/:username/follow', auth, profileCtrl.unfollowUser);

  // Article
  router.get('/articles', looseAuth, articleCtrl.getArticles);
  router.get('/articles/feed', auth, articleCtrl.feedArticles);
  router.get('/articles/:slug', looseAuth, articleCtrl.getArticle);
  router.post('/articles', auth, articleCtrl.createArticle);
  router.put('/articles/:slug', auth, articleCtrl.updateArticle);
  router.delete('/articles/:slug', auth, articleCtrl.deleteArticle);
  router.post('/articles/:slug/favorite', auth, articleCtrl.favoriteArticle);
  router.delete('/articles/:slug/favorite', auth, articleCtrl.unfavoriteArticle);

  // Comment
  router.post('/articles/:slug/comments', commentCtrl.createComment);
  router.get('/articles/:slug/comments', commentCtrl.getComments);
  router.delete('/articles/:slug/comments/:id', commentCtrl.deleteComment);

  // Tag
  router.get('/tags', tagCtrl.getTags);
};
