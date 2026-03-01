import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getSessionUser } from '@/lib/session';
import College from '@/models/College';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';

export default async function DashboardPage({ searchParams }: { searchParams: { page?: string } }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  await connectDB();
  const colleges = await College.find().sort({ name: 1 }).lean();

  const page = Math.max(Number(searchParams.page || '1'), 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ college: user.college._id })
    .populate('author', 'name role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] max-w-6xl mx-auto">
      <aside className="space-y-4">
        <div className="card overflow-hidden !p-0 shadow-[0_0_15px_rgba(,,,)]">
          <div className="h-16 bg-gradient-to-r from-[#295BF2] to-[#F26DDC]"></div>
          <div className="p-4 pt-0">
            <div className="h-12 w-12 rounded-full border-4 border-[#1A1A24] bg-[#12121A] flex items-center justify-center -mt-6 mb-2 shadow-[0_0_10px_rgba(,,,)]">
              <span className="text-xl font-bold text-[#72F2DB] drop-shadow-[0_0_5px_rgba(,,,)]">{user.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight drop-shadow-[0_0_2px_rgba(,,,)]">{user.name}</h2>
            <p className="text-sm text-gray-400 mb-3">{user.role}</p>
            <div className="pt-3 border-t border-[#2D2D3B]">
              <p className="text-xs font-semibold text-[#F26DDC] uppercase tracking-wider mb-1">Your College</p>
              <p className="text-sm font-bold text-gray-200">{user.college.name}</p>
            </div>
          </div>
        </div>

        <div className="card !p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#72F2DB] mb-3">Explore Communities</h3>
          <ul className="space-y-1 text-sm">
            {colleges.map((college) => (
              <li key={college._id.toString()}>
                <a className="flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-300 hover:bg-[#2D2D3B] hover:text-white font-medium transition-colors" href={`/community/${college._id}`}>
                  <span className="w-6 h-6 rounded bg-[#12121A] border border-[#2D2D3B] flex items-center justify-center text-[#F26DDC] text-xs font-bold shrink-0 shadow-[0_0_5px_rgba(,,,)]">{college.name.charAt(0)}</span>
                  <span className="truncate">{college.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="card !p-4 flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(,,,)]">College Feed</h1>
        </div>

        {posts.length === 0 && (
          <div className="card flex flex-col items-center justify-center p-12 text-center border-[#2D2D3B]">
            <h3 className="text-lg font-bold text-white">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-400">Be the first to share something with your college.</p>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post._id.toString()} post={JSON.parse(JSON.stringify(post))} currentUserId={user._id.toString()} />)}
        </div>

        <div className="flex justify-between items-center pt-4">
          {page > 1 ? (
            <a className="btn-ghost" href={`/dashboard?page=${page - 1}`}>Previous</a>
          ) : <div></div>}
          {posts.length === limit && (
            <a className="btn-ghost" href={`/dashboard?page=${page + 1}`}>Next</a>
          )}
        </div>
      </section>
    </div>
  );
}
