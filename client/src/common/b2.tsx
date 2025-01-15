// export const uploadImage = async (img: File) => {
//   let imgUrl = null;
//   const API_URL =
//     process.env.REACT_APP_API_ENDPOINT ||
//     "https://kku-blog-server-ak2l.onrender.com";

//   const formData = new FormData();
//   formData.append("file", img);

//   try {
//     const uploadResponse = await fetch(`${API_URL}/get-upload-picture`, {
//       method: "POST",
//       body: formData,
//     });

//     if (uploadResponse.ok) {
//       const { filename } = await uploadResponse.json();
//       imgUrl = `${API_URL}/uploads/${filename}`;
//     } else {
//       throw new Error("Error uploading image");
//     }
//   } catch (error) {
//     console.error("Error during image upload:", error);
//   }

//   return imgUrl; // ส่งกลับ URL ของไฟล์ที่อัพโหลด
// };

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../common/firebase";

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `profile-images/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL; // URL สำหรับบันทึกในฐานข้อมูล
};
