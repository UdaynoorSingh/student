'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  post: any;
  currentUserId?: string;
  isDetailView?: boolean;
};

export default function PostCard({ post, currentUserId, isDetailView }: Props) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.some((id: string) => id === currentUserId));
  const hasMultipleFiles = (post.files?.length || 0) > 1;

  function handlePostClick(e: React.MouseEvent) {
    if (isDetailView) return;
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    router.push(`/post/${post._id}`);
  }

  // Parse title and body
  let title = '';
  let body = post.content || '';
  const titleMatch = body.match(/^\*\*(.*?)\*\*(?:\s+([\s\S]*))?$/);
  if (titleMatch) {
    title = titleMatch[1];
    body = titleMatch[2] || '';
  }

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
        <div key={file.publicId} className="overflow-hidden rounded-md border border-gray-200 bg-gray-50">
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
          <div className="flex gap-2 border-t border-gray-200 bg-white p-2">
            <a href={file.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 flex-1 text-center py-1 rounded hover:bg-blue-50 transition">
              Open
            </a>
            <div className="w-px bg-gray-200"></div>
            <a
              href={getDownloadUrl(file.url)}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 flex-1 text-center py-1 rounded hover:bg-blue-50 transition"
              download={file.fileName || 'image'}
            >
              Download
            </a>
          </div>
        </div>
      );
    }

    return (
      <div
        key={file.publicId}
        className="flex h-32 flex-col justify-between rounded-md border border-gray-200 bg-white p-4 transition hover:border-gray-300 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-red-50 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{file.fileName}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase">PDF Document</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-gray-100">
          <a href={file.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            Preview
          </a>
          <a
            href={getDownloadUrl(file.url)}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            download={file.fileName || 'document.pdf'}
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  // Format date relative (e.g., "2h", "1d") or absolute
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, dateOptions);

  return (
    <article 
      className={`card !p-0 overflow-hidden bg-[#1A1A24] border-[#2D2D3B] transition-all duration-200 ${!isDetailView ? 'cursor-pointer hover:border-[#72F2DB]/50' : ''}`}
      onClick={handlePostClick}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 text-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-[#12121A] flex items-center justify-center text-[#72F2DB] font-bold border border-[#2D2D3B] shadow-[0_0_8px_rgba(,,,)]">
               {post.author?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-white leading-tight flex items-center gap-1.5 drop-shadow-[0_0_2px_rgba(,,,)]">
                {post.author?.name}
                <span className="text-gray-500 font-normal text-xs">•</span>
                <span className="text-xs text-gray-400 font-normal">{formattedDate}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{post.author?.role}</p>
            </div>
          </div>
        </div>

        <div className="mb-3">
          {title && (
            <Link href={`/post/${post._id}`}>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] hover:text-[#72F2DB] transition-colors">{title}</h2>
            </Link>
          )}
          {body && (
            <p className={`whitespace-pre-wrap text-sm text-gray-300 leading-relaxed ${!isDetailView ? 'line-clamp-4' : ''}`}>
              {body}
            </p>
          )}
        </div>

        {post.files?.length > 0 && (
          <div className={`grid gap-2 mb-3 mt-4 ${hasMultipleFiles ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xl'}`}>
            {post.files.map((file: any) => renderAttachment(file))}
          </div>
        )}
      </div>

      <div className="border-t border-[#2D2D3B] bg-[#12121A] px-2 py-1.5 flex items-center gap-1">
        <button 
          onClick={toggleLike} 
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors text-sm font-bold ${liked ? 'text-[#F26DDC] bg-[#F26DDC]/10 shadow-[0_0_10px_rgba(,,,)]' : 'text-gray-400 hover:bg-[#2D2D3B] hover:text-[#F26DDC]'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          {likesCount > 0 && <span>{likesCount}</span>}
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>
        <Link 
          href={`/post/${post._id}`} 
          className="flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors text-sm font-bold text-gray-400 hover:bg-[#2D2D3B] hover:text-[#72F2DB]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Comment
        </Link>
      </div>
    </article>
  );
}
