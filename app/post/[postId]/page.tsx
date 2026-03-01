import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import PostCard from '@/components/PostCard';
import { getSessionUser } from '@/lib/session';
import CommentThread from '@/components/CommentThread';
import Link from 'next/link';

function buildCommentTree(comments: any[]) {
  const map = new Map();
  const roots: any[] = [];
  comments.forEach((comment) => map.set(comment._id.toString(), { ...comment, replies: [] }));
  map.forEach((comment: any) => {
    if (comment.parentCommentId) {
      const parent = map.get(comment.parentCommentId.toString());
      if (parent) parent.replies.push(comment);
      else roots.push(comment);
    } else roots.push(comment);
  });
  return roots;
}

export default async function PostPage({ params }: { params: { postId: string } }) {
  const user = await getSessionUser();
  await connectDB();

  const post = await Post.findById(params.postId).populate('author', 'name role').populate('college', 'name').lean();
  if (!post) return <div className="card max-w-3xl mx-auto mt-8 text-center py-12">Post not found</div>;

  const comments = await Comment.find({ post: params.postId }).populate('author', 'name').sort({ createdAt: 1 }).lean();

  return (
    <div className="max-w-3xl mx-auto w-full space-y-4">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#72F2DB] mb-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
        Back to feed
      </Link>
      <PostCard post={JSON.parse(JSON.stringify(post))} currentUserId={user?._id.toString()} isDetailView={true} />
      <CommentThread comments={JSON.parse(JSON.stringify(buildCommentTree(comments)))} postId={params.postId} />
    </div>
  );
}
