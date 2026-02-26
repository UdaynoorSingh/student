'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPostAction } from '@/app/actions/postActions';

const initialState: { error?: string; success?: boolean } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn-primary">{pending ? 'Posting...' : 'Publish post'}</button>;
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPostAction as any, initialState);

  return (
    <form action={formAction} className="card mx-auto max-w-3xl space-y-4" encType="multipart/form-data">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] muted">Compose</p>
        <h1 className="mt-2 text-3xl font-semibold font-[var(--font-display)]">Create Post</h1>
      </div>

      <textarea name="content" required className="input min-h-36" placeholder="Share an update with your college community" />

      <div className="card-soft space-y-3">
        <label className="block text-sm font-medium">Attach files
          <input type="file" name="files" multiple accept="image/*,.pdf" className="mt-2 w-full text-sm" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublic" value="true" className="h-4 w-4 rounded border-[#cdbba5]" />
          Mark this post as public
        </label>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Posted successfully.</p>}

      <SubmitButton />
    </form>
  );
}
