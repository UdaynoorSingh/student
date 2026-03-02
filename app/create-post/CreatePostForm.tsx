'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPostAction } from '@/app/actions/postActions';
import { useState } from 'react';

const initialState: { error?: string; success?: boolean } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn-primary w-full sm:w-auto px-8 rounded-full shadow-[0_0_15px_rgba(,,,)] hover:shadow-[0_0_20px_rgba(,,,)] transition-all">{pending ? 'Posting...' : 'Post'}</button>;
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPostAction as any, initialState);
  const [activeTab, setActiveTab] = useState('post');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between border-b border-[#2D2D3B] pb-3">
        <h1 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(,,,)]">Create a post</h1>
        <button type="button" className="text-sm font-semibold text-[#F26DDC] hover:text-[#72F2DB] uppercase tracking-wider transition-colors">Drafts <span className="text-xs bg-[#F26DDC] text-white px-1.5 rounded-sm ml-1 drop-shadow-[0_0_5px_rgba(,,,)]">0</span></button>
      </div>

      <div className="mb-4">
        <div className="inline-flex items-center space-x-2 bg-[#1A1A24] border border-[#2D2D3B] rounded-md px-3 py-2 cursor-pointer hover:border-[#F26DDC]/50 transition-colors">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#295BF2] to-[#F26DDC] flex-shrink-0"></div>
          <span className="text-sm font-bold text-white">Select a community</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      <div className="bg-[#1A1A24] rounded-md border border-[#2D2D3B] overflow-hidden shadow-[0_0_20px_rgba(,,,)] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26DDC]/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex border-b border-[#2D2D3B] bg-[#12121A]">
          <button type="button" onClick={() => setActiveTab('post')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-r border-[#2D2D3B] transition-colors ${activeTab === 'post' ? 'text-[#72F2DB] bg-[#1A1A24] border-t-2 border-t-[#72F2DB]' : 'text-gray-400 hover:bg-[#1A1A24]/60'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Post
          </button>
          <button type="button" onClick={() => setActiveTab('media')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-r border-[#2D2D3B] transition-colors ${activeTab === 'media' ? 'text-[#72F2DB] bg-[#1A1A24] border-t-2 border-t-[#72F2DB]' : 'text-gray-400 hover:bg-[#1A1A24]/60'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Images & Video
          </button>
          <button type="button" className="flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 text-gray-500 cursor-not-allowed hidden sm:flex">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            Link
          </button>
        </div>

        <form action={formAction} className="relative z-10 p-4" encType="multipart/form-data">
          <input type="hidden" name="content" value={`${title ? `**${title}**\n\n` : ''}${body}`} />

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                maxLength={300}
                className="w-full bg-[#0A0A0F] border border-[#2D2D3B] text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#F26DDC] focus:ring-1 focus:ring-[#F26DDC] placeholder:text-gray-500 transition-colors" 
                placeholder="Title" 
              />
              <span className="absolute right-3 top-3 text-xs text-gray-500">{title.length}/300</span>
            </div>

            {activeTab === 'post' && (
              <div className="border border-[#2D2D3B] rounded-md overflow-hidden bg-[#0A0A0F] focus-within:border-[#F26DDC] focus-within:ring-1 focus-within:ring-[#F26DDC] transition-colors">
                <div className="bg-[#12121A] border-b border-[#2D2D3B] px-3 py-2 flex items-center gap-4 text-gray-400">
                  <span className="font-bold hover:text-white cursor-pointer transition-colors">B</span>
                  <span className="italic hover:text-white cursor-pointer transition-colors">i</span>
                  <span className="line-through hover:text-white cursor-pointer transition-colors">S</span>
                  <div className="h-4 w-px bg-[#2D2D3B]"></div>
                  <span className="hover:text-white cursor-pointer transition-colors font-mono font-bold">{"</>"}</span>
                </div>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full min-h-[160px] resize-none bg-transparent text-white px-4 py-3 text-sm focus:outline-none placeholder:text-gray-500" 
                  placeholder="Body text (optional)" 
                />
              </div>
            )}

            <div className={`space-y-4 ${activeTab === 'media' ? 'block' : 'hidden'}`}>
              <div className="border-2 border-dashed border-[#2D2D3B] rounded-md p-8 flex flex-col items-center justify-center bg-[#0A0A0F] hover:border-[#F26DDC]/40 transition-colors">
                <p className="text-gray-400 mb-4 text-sm font-medium">Drag and drop images or upload</p>
                <input type="file" name="files" multiple accept="image/*,.pdf" className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-bold
                  file:bg-[#295BF2]/20 file:text-[#72F2DB]
                  hover:file:bg-[#295BF2]/40 cursor-pointer transition-all focus:outline-none" 
                />
              </div>
            </div>
            
            <div className="flex items-center pt-2">
              <input type="checkbox" id="isPublic" name="isPublic" value="true" className="h-4 w-4 rounded border-[#2D2D3B] bg-[#0A0A0F] text-[#F26DDC] focus:ring-[#F26DDC]/50 cursor-pointer accent-[#F26DDC]" />
              <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors">
                Make this post public
              </label>
            </div>
          </div>

          {state?.error && <p className="mt-4 animate-fade-in rounded-md bg-red-900/30 p-3 text-sm font-medium text-red-400 border border-red-900/50">{state.error}</p>}
          {state?.success && <p className="mt-4 animate-fade-in rounded-md bg-green-900/30 p-3 text-sm font-medium text-[#72F2DB] border border-[#72F2DB]/30">Posted successfully.</p>}

          <div className="pt-4 flex justify-end gap-3 border-t border-[#2D2D3B] mt-4">
            <button type="button" className="btn-ghost rounded-full px-6 py-2">Save Draft</button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
