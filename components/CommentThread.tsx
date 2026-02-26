'use client';

import { useState } from 'react';

type CommentNode = {
  _id: string;
  content: string;
  author?: { name: string };
  createdAt: string;
  replies?: CommentNode[];
};

export default function CommentThread({ comments, postId }: { comments: CommentNode[]; postId: string }) {
  const [value, setValue] = useState('');

  async function submitComment(parentCommentId?: string) {
    const content = parentCommentId ? prompt('Reply') : value;
    if (!content) return;

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content, parentCommentId })
    });

    if (response.ok) window.location.reload();
  }

  const renderNode = (comment: CommentNode, depth = 0): JSX.Element => (
    <div key={comment._id} className="space-y-2" style={{ marginLeft: depth * 14 }}>
      <div className="card-soft">
        <p className="text-xs muted">{comment.author?.name} | {new Date(comment.createdAt).toLocaleString()}</p>
        <p className="mt-1 leading-6">{comment.content}</p>
        <button className="mt-2 text-xs font-medium text-[#9d4520] hover:text-[#7f3418]" onClick={() => submitComment(comment._id)}>Reply</button>
      </div>
      {comment.replies?.map((reply) => renderNode(reply, depth + 1))}
    </div>
  );

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Comments</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="input flex-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Add comment" />
        <button className="btn-primary" onClick={() => submitComment()}>Send</button>
      </div>
      <div className="space-y-2">{comments.map((comment) => renderNode(comment))}</div>
    </div>
  );
}
