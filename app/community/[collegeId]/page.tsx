import { connectDB } from '@/lib/db';
import College from '@/models/College';
import Post from '@/models/Post';
import { getSessionUser } from '@/lib/session';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default async function CommunityPage({ params, searchParams }: { params: { collegeId: string }; searchParams: { page?: string } }) {
  const user = await getSessionUser();
  const page = Math.max(Number(searchParams.page || '1'), 1);

  await connectDB();
  const college = await College.findById(params.collegeId).lean();
  if (!college) return <div className="card max-w-3xl mx-auto mt-8 text-center py-12">College not found</div>;

  const posts = await Post.find({ college: params.collegeId })
    .populate('author', 'name role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * 10)
    .limit(10)
    .lean();

  const isMember = user?.college?._id.toString() === params.collegeId;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] max-w-6xl mx-auto">
      <aside className="space-y-4">
        <div className="card !p-0 overflow-hidden shadow-[0_0_15px_rgba(,,,)] border-[#2D2D3B] bg-[#1A1A24]">
          <div className="h-20 bg-gradient-to-r from-[#295BF2] to-[#72F2DB]"></div>
          <div className="p-4 pt-0">
             <div className="h-16 w-16 rounded-lg border-4 border-[#1A1A24] bg-[#12121A] flex items-center justify-center -mt-8 mb-3 shadow-[0_0_10px_rgba(,,,)]">
              <span className="text-2xl font-bold text-[#F26DDC] drop-shadow-[0_0_5px_rgba(,,,)]">{college.name.charAt(0)}</span>
            </div>
            <h1 className="text-xl font-bold leading-tight text-white drop-shadow-[0_0_2px_rgba(,,,)]">{college.name}</h1>
            <p className="text-sm text-gray-400 mt-1">Official Community Space</p>
            
            <div className="mt-4 pt-4 border-t border-[#2D2D3B]">
               {isMember ? (
                <div className="rounded-md bg-[#72F2DB]/10 p-2 text-xs font-bold text-[#72F2DB] border border-[#72F2DB]/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(,,,)]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                   You are a member
                </div>
              ) : (
                <div className="rounded-md bg-[#12121A] p-2 text-xs text-gray-400 border border-[#2D2D3B]">
                   Viewing as guest. Read-only mode active.
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-[#72F2DB] transition-colors flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
             Back
          </Link>
          <h2 className="text-lg font-bold text-white drop-shadow-[0_0_5px_rgba(,,,)]">Community Feed</h2>
        </div>

        {posts.length === 0 && (
          <div className="card flex flex-col items-center justify-center p-12 text-center border-[#2D2D3B] bg-[#1A1A24]">
            <h3 className="text-lg font-bold text-white">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-400">Be the first to share something with this community.</p>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post._id.toString()} post={JSON.parse(JSON.stringify(post))} currentUserId={user?._id.toString()} />)}
        </div>

        <div className="flex justify-between items-center pt-4">
          {page > 1 ? (
            <a className="btn-ghost" href={`/community/${params.collegeId}?page=${page - 1}`}>Previous</a>
          ) : <div></div>}
          {posts.length === 10 && (
            <a className="btn-ghost" href={`/community/${params.collegeId}?page=${page + 1}`}>Next</a>
          )}
        </div>
      </section>
    </div>
  );
}
