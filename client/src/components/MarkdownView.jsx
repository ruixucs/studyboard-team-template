/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  client/src/components/MarkdownView.jsx
 *
 *  Render a Markdown string as HTML, with GFM (tables, strikethrough, etc.)
 *  and syntax-highlighted code blocks.
 *
 *  Already installed in package.json:
 *    - react-markdown
 *    - remark-gfm
 *    - highlight.js
 *
 *  Props: { source: string }
 *
 *  Implementation notes:
 *    1. <ReactMarkdown remarkPlugins={[remarkGfm]}>{source || ''}</ReactMarkdown>
 *    2. After rendering, run hljs on every <pre code> that hasn't been highlighted yet:
 *         useEffect(() => {
 *           document.querySelectorAll('pre code:not(.hljs)').forEach(el => hljs.highlightElement(el))
 *         })
 *    3. Wrap the output in a Tailwind `prose` container so headings/lists/code look right:
 *         className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-900
 *                    prose-code:before:content-none prose-code:after:content-none"
 *    4. The dark code-block theme is imported globally via `highlight.js/styles/github-dark.css`.
 * ============================================================================
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect } from 'react';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownView({ source }) {
  // TODO(Ray): useEffect that runs hljs.highlightElement on every un-highlighted <pre code>

  return (
    <div className="prose max-w-none">
      {/* TODO(Ray): <ReactMarkdown remarkPlugins={[remarkGfm]}>{source || ''}</ReactMarkdown> */}
    </div>
  );
}
