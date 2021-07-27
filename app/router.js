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

  const { router } = app;

  router.prefix('/api');

  // Users
  router.post('/users/login', userCtrl.login);
  router.post('/users', userCtrl.register);
  router.get('/user', userCtrl.getCurrentUser);
  router.put('/user', userCtrl.updateUser);

  // Profile
  router.get('/profiles/:username', profileCtrl.getProfile);
  router.post('/profiles/:username/follow', profileCtrl.followUser);
  router.delete('/profiles/:username/follow', profileCtrl.unfollowUser);

  // Article
  router.get('/articles', articleCtrl.getArticles);
  router.get('/articles/feed', articleCtrl.feedArticles);
  router.get('/articles/:slug', articleCtrl.getArticle);
  router.post('/articles', articleCtrl.createArticle);
  router.put('/articles/:slug', articleCtrl.updateArticle);
  router.delete('/articles/:slug', articleCtrl.deleteArticle);
  router.post('/articles/:slug/favorite', articleCtrl.favoriteArticle);
  router.delete('/articles/:slug/favorite', articleCtrl.unfavoriteArticle);

  // Comment
  router.post('/articles/:slug/comments', commentCtrl.createComment);
  router.get('/articles/:slug/comments', commentCtrl.getComments);
  router.delete('/articles/:slug/comments/:id', commentCtrl.deleteComment);

  // Tag
  router.get('/tags', tagCtrl.getTags);
};
