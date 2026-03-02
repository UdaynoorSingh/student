import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';
import { getSessionUser } from '@/lib/session';

export default async function PublicPage({ searchParams }: { searchParams: { page?: string } }) {
  const user = await getSessionUser();
  const page = Math.max(Number(searchParams.page || '1'), 1);

  await connectDB();
  const posts = await Post.find({ isPublic: true })
    .populate('author', 'name role')
    .populate('college', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * 10)
    .limit(10)
    .lean();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] max-w-6xl mx-auto">
      <aside className="space-y-4">
        <div className="card !p-4 border-[#2D2D3B] bg-[#1A1A24]">
          <h2 className="text-lg font-bold text-white mb-2 drop-shadow-[0_0_5px_rgba(,,,)]">Public Feed</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Welcome to the global student network. Discover projects, notes, and discussions from students across all universities.
          </p>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="card !p-4 flex items-center justify-between mb-2 border-[#2D2D3B] bg-[#1A1A24]">
          <h1 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(,,,)]">Global Posts</h1>
        </div>

        {posts.length === 0 && (
          <div className="card flex flex-col items-center justify-center p-12 text-center border-[#2D2D3B] bg-[#1A1A24]">
            <h3 className="text-lg font-bold text-white">No public posts yet</h3>
            <p className="mt-1 text-sm text-gray-400">Check back later for updates from the community.</p>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post._id.toString()} post={JSON.parse(JSON.stringify(post))} currentUserId={user?._id.toString()} />)}
        </div>

        <div className="flex justify-between items-center pt-4">
          {page > 1 ? (
            <a className="btn-ghost" href={`/public?page=${page - 1}`}>Previous</a>
          ) : <div></div>}
          {posts.length === 10 && (
            <a className="btn-ghost" href={`/public?page=${page + 1}`}>Next</a>
          )}
        </div>
      </section>
    </div>
  );
}
