import { supabase } from "../lib/supabase";

const getImgUrl = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-image")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("product-image")
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  export { getImgUrl };