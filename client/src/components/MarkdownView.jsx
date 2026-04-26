import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect } from 'react';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownView({ source }) {
  useEffect(() => {
    document.querySelectorAll('pre code:not(.hljs)').forEach((el) => {
      hljs.highlightElement(el);
    });
  });

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source || ''}</ReactMarkdown>
    </div>
  );
}
