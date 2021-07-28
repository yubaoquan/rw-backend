# realworld-backend

## 疑难杂症

1. 发送请求的时候如果请求头里没有 content-type, controller 中拿到的 request.body 是空对象

## 接口进度

- done POST /api/users/login
- done POST /api/users
- done GET /api/user
- done PUT /api/user
- done GET /api/profiles/:username
- done POST /api/profiles/:username/follow
- done DELETE /api/profiles/:username/follow
- done GET /api/articles
- done GET /api/articles/feed
- done GET /api/articles/:slug
- done POST /api/articles
- done PUT /api/articles/:slug
- done DELETE /api/articles/:slug
- POST /api/articles/:slug/comments
- GET /api/articles/:slug/comments
- DELETE /api/articles/:slug/comments/:id
- POST /api/articles/:slug/favorite
- DELETE /api/articles/:slug/favorite
- GET /api/tags
