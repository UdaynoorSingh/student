'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  post: any;
  currentUserId?: string;
};

export default function PostCard({ post, currentUserId }: Props) {
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.some((id: string) => id === currentUserId));
  const hasMultipleFiles = (post.files?.length || 0) > 1;

  async function toggleLike() {
    const response = await fetch(`/api/posts/${post._id}/like`, { method: 'PATCH' });
    if (!response.ok) return;
    const data = await response.json();
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  }

  function getDownloadUrl(url: string) {
    return url.includes('/upload/') ? url.replace('/upload/', '/upload/fl_attachment/') : url;
  }

  function renderAttachment(file: any) {
    if (file.fileType === 'image') {
      return (
        <div key={file.publicId} className="overflow-hidden rounded-2xl border border-[#dacbb8] bg-[#f8f2e9]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={file.url}
              alt={file.fileName || 'Post attachment'}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex gap-2 border-t border-[#dacbb8] bg-transparent p-2">
            <a href={file.url} target="_blank" rel="noreferrer" className="btn-ghost text-xs text-slate-800">
              Open Image
            </a>
            <a
              href={getDownloadUrl(file.url)}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost text-xs text-slate-800"
              download={file.fileName || 'image'}
            >
              Download Image
            </a>
          </div>
        </div>
      );
    }

    return (
      <div
        key={file.publicId}
        className="flex h-64 flex-col justify-between rounded-2xl border border-[#dacbb8] bg-gradient-to-br from-[#101722] to-[#1c2f53] p-4 text-white sm:h-72"
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-white/70">PDF Document</p>
          <p className="mt-2 line-clamp-2 text-base font-semibold">{file.fileName}</p>
        </div>
        <div className="flex gap-2">
          <a href={file.url} target="_blank" rel="noreferrer" className="btn-ghost text-xs text-white">
            Open PDF
          </a>
          <a
            href={getDownloadUrl(file.url)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-xs text-white"
            download={file.fileName || 'document.pdf'}
          >
            Download PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm muted">
        <span className="font-medium text-slate-700">{post.author?.name} | {post.author?.role}</span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      <p className="whitespace-pre-wrap leading-7">{post.content}</p>

      {post.files?.length > 0 && (
        <div className={`grid gap-3 ${hasMultipleFiles ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {post.files.map((file: any) => renderAttachment(file))}
        </div>
      )}

      <div className="flex items-center gap-3 text-sm">
        <button onClick={toggleLike} className="btn-ghost">{liked ? 'Unlike' : 'Like'} ({likesCount})</button>
        <Link href={`/post/${post._id}`} className="font-medium text-[#9d4520] hover:text-[#7f3418]">View thread</Link>
      </div>
    </article>
  );
}
