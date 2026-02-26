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
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] muted">Your space</p>
          <h2 className="mt-2 text-xl font-semibold">{user.college.name}</h2>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider muted">Communities</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {colleges.map((college) => (
              <li key={college._id.toString()}>
                <a className="block rounded-lg px-2 py-1 hover:bg-[#f4ede1]" href={`/community/${college._id}`}>{college.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] muted">Dashboard</p>
          <h1 className="heading-display mt-2 font-[var(--font-display)]">College Feed</h1>
        </div>

        {posts.length === 0 && <div className="card muted">No posts yet. Be the first to post.</div>}
        {posts.map((post) => <PostCard key={post._id.toString()} post={JSON.parse(JSON.stringify(post))} currentUserId={user._id.toString()} />)}

        <div className="flex gap-2">
          {page > 1 && <a className="btn-ghost" href={`/dashboard?page=${page - 1}`}>Previous</a>}
          <a className="btn-ghost" href={`/dashboard?page=${page + 1}`}>Next</a>
        </div>
      </section>
    </div>
  );
}
