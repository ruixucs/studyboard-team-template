/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  client/src/pages/PostDetail.jsx
 *
 *  Single post page. URL: /courses/:id/posts/:postId
 *
 *  This page renders:
 *    - Post title
 *    - Author + timestamp ("(edited)" if updatedAt !== createdAt)
 *    - Edit / Delete actions if the current user is the author
 *    - Post body via <MarkdownView />
 *    - <LikeButton /> (this component is owned by Donovan, you just import + render it)
 *    - <ReplyList /> (your component) below
 *
 *    When `editing` state is true, swap the body for <PostEditor /> instead.
 *
 *  APIs:
 *    api.get(`/posts/${postId}`)            // returns hydrated post + replies
 *    api.patch(`/posts/${postId}`, { title, body })
 *    api.delete(`/posts/${postId}`)
 *
 *  Local state: post, err, editing
 *
 *  Functions:
 *    load(): GET /posts/:postId, setPost
 *    save({title, body}): PATCH; setEditing(false); load()
 *    del(): if (!confirm(...)) return; DELETE; nav(`/courses/${courseId}`)
 *
 *  IMPORTANT — how to use Donovan's <LikeButton>:
 *    <LikeButton
 *      postId={post.id}
 *      initialLiked={post.likedByMe}
 *      initialCount={post.likeCount}
 *    />
 *    The button itself takes care of the API calls — you just pass the props.
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import MarkdownView from '../components/MarkdownView.jsx';
import PostEditor from '../components/PostEditor.jsx';
import LikeButton from '../components/LikeButton.jsx'; // implemented by Donovan
import ReplyList from '../components/ReplyList.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

export default function PostDetail() {
  const { postId, id: courseId } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();

  // TODO(Ray): state hooks (post, err, editing)

  // TODO(Ray): load() / save({title, body}) / del()

  // TODO(Ray): useEffect to load() on [postId]

  // TODO(Ray): early returns:
  //   if (err)  return <main>...{err}</main>
  //   if (!post) return <main>Loading…</main>

  // TODO(Ray): isAuthor = user?.id === post.author?.id

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* TODO(Ray): editing ? <PostEditor onSubmit={save} ... /> : (
            <>
              <h1>{post.title}</h1>
              <div>{author} · {createdAt} {(edited)?} {isAuthor && Edit/Delete}</div>
              <MarkdownView source={post.body} />
              <LikeButton postId={post.id} initialLiked={post.likedByMe} initialCount={post.likeCount} />
            </>
          )
      */}
      {/* TODO(Ray): <ReplyList postId={post.id} replies={post.replies} onChange={load} /> */}
    </main>
  );
}
