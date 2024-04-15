import React, { ChangeEvent, useEffect, useState } from 'react';
import { editProduct, getProductsByProductId } from '../../../services/apiService';
import { Formik, Field, ErrorMessage, Form, FieldArray } from 'formik';
import { addNewItemValidationSchema } from '../../../utils/Validation';
import './SellerProductEdit.scss';

interface ProductData {
  style: any;
  productCategory: any;
  productDescription: any;
  productId: string;
  sellerEmail: string;
  name: string;
  material: string;
  price: number;
  category: string;
  productImages: { productImageUrl: string }[];
  variations: { color: string; sizeQuantities: { size: string; qty: string }[] }[];
}

interface SizeQuantity {
  size: string;
  qty: string;
}

interface Variation {
  color: string;
  sizeQuantities: SizeQuantity[];
}

const SellerProductEdit = ({ productId, onClose }: { productId: string | null; onClose: () => void }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pId, setPtId] = useState('');
  const [selectedFiles, setSelectedFilesNew] = useState<File[]>([]);

  useEffect(() => {
    if (productId) {
      getProductDetails(productId);
    }
  }, []);

  const getProductDetails = async (id: string) => {
    const product = await getProductsByProductId(id);
    setProductData(product);
    setPtId(id);
    console.log('Product data', product);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      setSelectedFilesNew(filesArray);
    }
  };


  const editProductFormSubmit = async (values: any, { resetForm }: any) => {
    try {
      const email = sessionStorage.getItem("email");
      const productDataForm = new FormData();
  
      if (email) {
        productDataForm.append("sellerEmail", email);
      }
      productDataForm.append("name", values.name);
      productDataForm.append("category", values.category);
      productDataForm.append("material", values.material);
      productDataForm.append("productDescription", values.productDescription);
      productDataForm.append("productCategory", values.productCategory);
      productDataForm.append("style", values.style);
      productDataForm.append("price", values.price);
  
      productDataForm.append("variation", JSON.stringify(values.variation));
  
      if (selectedFiles) {
       // Append each selected file to the FormData object
      selectedFiles.forEach((file) => {
        productDataForm.append('productImages', file);
      });
      }
  
      const updatedProduct = await editProduct(productDataForm, pId);
  
      if (updatedProduct) {
        setLoading(false);
        setProductData({ ...productData, ...values }); // Update productData with edited values
        setSelectedFilesNew([]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  


  
  return (
    <div className="update-product-main">
      {productData && (
        <>
          <p className="update-product">Update Product : {productId}</p>
          <p>Pname : {productData?.name}</p>
          <hr />

          <div className="new-item-form">
            <Formik
              initialValues={{
                name: productData ? productData.name : '',
                category: productData ? productData.category : '',
                material: productData ? productData.material : '',
                productDescription: productData ? productData.productDescription : '',
                productCategory: productData ? productData.productCategory : '',
                style: productData ? productData.style : '',
                price: productData ? productData.price : '',
                variation: productData ? productData.variations : [],
              }}
              validationSchema={addNewItemValidationSchema}
              onSubmit={editProductFormSubmit}
            >
              {({ values }) => (
                <Form>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Product Name * :</label>
                      <Field type="text" id="name" name="name" />
                    </div>
                    <ErrorMessage name="name" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Category * :</label>
                      <Field type="text" id="category" name="category" />
                    </div>
                    <ErrorMessage name="category" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Material * :</label>
                      <Field type="text" id="material" name="material" />
                    </div>
                    <ErrorMessage name="material" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Product Description * :</label>
                      <Field type="text" id="productDescription" name="productDescription" />
                    </div>
                    <ErrorMessage name="productDescription" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Product Category * :</label>
                      <Field type="text" id="productCategory" name="productCategory" />
                    </div>
                    <ErrorMessage name="productCategory" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Style * :</label>
                      <Field type="text" id="style" name="style" />
                    </div>
                    <ErrorMessage name="style" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="field-input">
                      <label>Price * :</label>
                      <Field type="number" id="price" name="price" />
                    </div>
                    <ErrorMessage name="price" component="div" className="error" />
                  </div>

                  <div className="field-container">
                    <div className="file-input-container">
                      <label className="file-label">Images :</label>
                      <div className="name">
                        <label htmlFor="fileInput" className="file-input-label">
                          <span className="button">Choose Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            className="file-input"
                            onChange={handleFileChange}
                            multiple // Allow multiple files to be selected
                          />
                        </label>
                        <div className="fileName">
                          {selectedFile && (
                            <div>
                              <span className="file-name">{selectedFile.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <div className="variation-header">
                    <p>Variations</p>
                    <FieldArray name="variation">
                      {({ push, remove }) => (
                        <>
                          {values.variation.map((v: Variation, index: number) => (
                            <div key={index} className="form-container">
                              <div className="buttons">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  Remove Variation
                                </button>
                              </div>
                              <div key={index} className="field-container">
                                <div className="field-input">
                                  <Field type="text" name={`variation.${index}.color`} placeholder="Color" />
                                </div>
                                <ErrorMessage name={`variation.${index}.color`} component="div" className="error" />

                                <FieldArray name={`variation.${index}.sizeQuantities`}>
                                  {({ push: pushSizeQuantity, remove: removeSizeQuantity }) => (
                                    <>
                                      {v.sizeQuantities.map((sq: SizeQuantity, sqIndex: number) => (
                                        <div key={sqIndex} className="form-container">
                                          <div className="buttons">
                                            <button
                                              className="btn btn-danger"
                                              onClick={() => removeSizeQuantity(sqIndex)}
                                              type="button"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                          <div className="field-input">
                                            <Field
                                              type="text"
                                              name={`variation.${index}.sizeQuantities.${sqIndex}.size`}
                                              placeholder="Size"
                                            />
                                            <ErrorMessage name={`variation.${index}.sizeQuantities.${sqIndex}.size`} component="div" className="error" />
                                            <Field
                                              type="text"
                                              name={`variation.${index}.sizeQuantities.${sqIndex}.qty`}
                                              placeholder="Quantity"
                                            />
                                            <ErrorMessage name={`variation.${index}.sizeQuantities.${sqIndex}.qty`} component="div" className="error" />
                                          </div>
                                        </div>
                                      ))}
                                      <div className="buttons">
                                        <button
                                          className="btn btn-success"
                                          onClick={() => pushSizeQuantity({ size: '', qty: '' })}
                                          type="button"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </FieldArray>
                              </div>
                            </div>
                          ))}
                          <div className="buttons">
                            <button
                              className="btn btn-info"
                              onClick={() => push({ color: '', sizeQuantities: [{ size: '', qty: '' }] })}
                              type="button"
                            >
                              Add Variation
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>

                  <div className="field-container">
                    <div className="buttons">
                      <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="loader">
                            <span>Loading...</span>
                            <div className="spinner" />
                          </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerProductEdit;
