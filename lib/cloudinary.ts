import crypto from 'crypto';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadToCloudinary(file: File, resourceType: 'image' | 'raw' | 'auto') {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary env variables are missing');
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `sluglime/${resourceType}`;
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey!);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Cloudinary upload failed';
    throw new Error(message);
  }

  const assetUrl = (data.secure_url || data.url) as string | undefined;
  if (!assetUrl) {
    throw new Error('Cloudinary upload succeeded but no file URL was returned');
  }

  return {
    url: assetUrl,
    publicId: data.public_id as string,
    resourceType
  };
}
