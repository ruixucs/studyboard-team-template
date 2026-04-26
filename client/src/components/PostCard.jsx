import { Link } from 'react-router-dom';

function fmt(iso) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function PostCard({ post }) {
  return (
    <Link
      to={`/courses/${post.courseId}/posts/${post.id}`}
      className="block rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-accent transition"
    >
      <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.body}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span>{post.author?.displayName || '[deleted]'}</span>
        <span>·</span>
        <span>{fmt(post.createdAt)}</span>
        <span className="ml-auto flex items-center gap-2">
          <span>♥ {post.likeCount}</span>
          <span>💬 {post.replyCount}</span>
        </span>
      </div>
    </Link>
  );
}
