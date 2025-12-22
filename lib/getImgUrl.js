import { createSupabaseClient } from "./createSupabaseClient";

const getImgUrl = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await createSupabaseClient.storage
    .from("product-image")
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = createSupabaseClient.storage
    .from("product-image")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export { getImgUrl };