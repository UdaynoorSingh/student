'use client';

import React, { useState } from 'react';

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

  const renderNode = (comment: CommentNode, depth = 0) => (
    <div key={comment._id} className="relative mt-4">
      <div className="flex gap-3">
        {/* Thread line visual */}
        {depth > 0 && (
           <div className="absolute left-[-20px] top-6 bottom-[-16px] w-[2px] bg-[#2D2D3B]"></div>
        )}
        
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#12121A] flex items-center justify-center text-[#72F2DB] font-bold text-xs border border-[#2D2D3B] shadow-[0_0_5px_rgba(,,,)]">
           {comment.author?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        
        <div className="flex-1">
          <div className="bg-[#0A0A0F] rounded-lg p-3 border border-[#2D2D3B] shadow-inner">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white drop-shadow-[0_0_2px_rgba(,,,)]">{comment.author?.name}</span>
              <span className="text-xs text-gray-500 font-normal">{new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          </div>
          
          <div className="flex gap-3 mt-1 ml-1 text-xs">
            <button 
              className="font-bold text-gray-400 hover:text-[#F26DDC] transition-colors" 
              onClick={() => submitComment(comment._id)}
            >
              Reply
            </button>
          </div>
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-6 relative">
              {comment.replies.map((reply) => renderNode(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card !p-0 overflow-hidden mt-4 border-[#2D2D3B] bg-[#1A1A24]">
      <div className="p-4 sm:p-5 border-b border-[#2D2D3B] bg-[#12121A]">
        <h2 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_5px_rgba(,,,)]">Comments</h2>
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#1A1A24] flex items-center justify-center text-[#72F2DB] font-bold border border-[#2D2D3B] shadow-[0_0_5px_rgba(,,,)]">
             U
          </div>
          <div className="flex flex-1 flex-col gap-2 relative">
            <input 
              className="input pr-20 py-2.5 w-full bg-[#0A0A0F] border-[#2D2D3B] text-white focus:border-[#F26DDC] focus:ring-[#F26DDC] transition-colors placeholder:text-gray-500" 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder="Add a comment..." 
            />
            <button 
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded text-sm font-bold bg-[#295BF2] text-white hover:bg-[#F26DDC] hover:shadow-[0_0_10px_rgba(,,,)] transition disabled:opacity-50 disabled:hover:bg-[#295BF2] disabled:hover:shadow-none" 
              onClick={() => submitComment()}
              disabled={!value.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      
      {comments.length > 0 ? (
        <div className="p-4 sm:p-5 pt-2 bg-[#1A1A24]">
          <div className="space-y-1">
            {comments.map((comment) => renderNode(comment))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#1A1A24]">
          <p className="text-sm text-gray-500">No comments yet. Be the first to start the discussion.</p>
        </div>
      )}
    </div>
  );
}
