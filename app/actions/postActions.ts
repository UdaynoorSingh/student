'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';

type ActionState = { error?: string; success?: boolean };

function getInternalApiBaseUrl() {
  const host = headers().get('host');
  const proto = headers().get('x-forwarded-proto') || 'http';
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function createPostAction(_prevState: ActionState, formData: FormData) {
  const token = cookies().get('token')?.value;
  if (!token) {
    return { error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${getInternalApiBaseUrl()}/api/posts`, {
      method: 'POST',
      headers: {
        Cookie: `token=${token}`
      },
      body: formData,
      cache: 'no-store'
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data.message || 'Failed to create post' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/public');
    return { success: true };
  } catch {
    return { error: 'Failed to create post' };
  }
}

export async function addCommentAction(payload: { postId: string; content: string; parentCommentId?: string }) {
  const token = cookies().get('token')?.value;
  if (!token) return { error: 'Unauthorized' };

  const response = await fetch(`${getInternalApiBaseUrl()}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${token}`
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  if (!response.ok) {
    const data = await response.json();
    return { error: data.message || 'Failed to comment' };
  }

  revalidatePath(`/post/${payload.postId}`);
  return { success: true };
}
