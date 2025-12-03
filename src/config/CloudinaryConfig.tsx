import CryptoJS from "crypto-js";
const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const apiSecret = import.meta.env.VITE_API_SECRET;
const apiKey = import.meta.env.VITE_API_KEY;

export const uploadImageToCloudinary = async (imgFile: File, folderName: string) => {

  const formData = new FormData();
  formData.append('file', imgFile);
  formData.append('upload_preset', upload_preset);
  formData.append('cloud_name', cloud_name);

  if (folderName) {
    formData.append('folder', folderName);
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};


export const deleteImageFromCloudinary = async (publicId: string) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);

  const signature = CryptoJS.SHA1(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`).toString();

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
};