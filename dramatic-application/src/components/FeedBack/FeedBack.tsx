interface Feedback {
  id?: string;
  userId: string;
  productId: string;
  comment: string;
  rating: number;
  uploadImageList?: File[]; // Change the type to an array of File objects
}

  
  interface ProductImageUrls {
    // Define properties for the ProductImageUrls if needed
  }

  export default Feedback