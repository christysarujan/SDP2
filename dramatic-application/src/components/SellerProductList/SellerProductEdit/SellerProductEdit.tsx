import React, { ChangeEvent, useEffect, useState } from 'react';
import { editProduct, getProductsByProductId } from '../../../services/apiService';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { addNewItemValidationSchema, addNewItemFormInitialValues, } from '../../../utils/Validation';
import './SellerProductEdit.scss';

interface ProductData {
  productId: string;
  sellerEmail: string;
  name: string;
  material: string;
  price: number;
  category: string;
  productImages: { productImageUrl: string }[];
  variations: { color: string; sizeQuantities: { size: string; quantity: number }[] }[];
}

interface SizeQuantity {
  size: string;
  qty: string;
}

interface Variation {
  color: string;
  sizeQuantityDTOS: SizeQuantity[];
}

const SellerProductEdit = ({ productId, onClose }: { productId: string | null; onClose: () => void }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pId, setPtId] = useState('');

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [variation, setVariations] = useState<Variation[]>([
    {
      color: '',
      sizeQuantityDTOS: [{ size: '', qty: '' }],
    },
  ]);

  const handleAddSizeQuantity = (index: number) => {
    const newVariations = [...variation];
    newVariations[index].sizeQuantityDTOS.push({ size: '', qty: '' });
    setVariations(newVariations);
  };

  const handleAddColor = () => {
    setVariations([...variation, { color: '', sizeQuantityDTOS: [{ size: '', qty: '' }] }]);
  };

  const editProductFormSubmit = async (values: any, { resetForm }: any) => {
    console.log('edit form submit', values);

    try {
      const email = sessionStorage.getItem("email");
      const productDataForm = new FormData();

      if (email) {
        productDataForm.append("sellerEmail", email);
      }
      productDataForm.append("name", values.name);
      productDataForm.append("category", values.category);
      productDataForm.append("material", values.material);
      productDataForm.append("price", values.price);
      productDataForm.append("variation", JSON.stringify(values.variation));

      if (selectedFile) {
        productDataForm.append(
          "productImages",
          selectedFile,
          selectedFile.name
        );
      }

      const products = await editProduct(productDataForm, pId);

      if (products) {
        setLoading(false);
        resetForm();
        resetForm({
          values: addNewItemFormInitialValues,
          errors: {},
          touched: {},
          isValidating: false,
          isSubmitting: false,
        });

        setVariations([
          {
            color: "",
            sizeQuantityDTOS: [{ size: "", qty: "" }],
          },
        ]);

        setSelectedFile(null);
      } else {
        setLoading(false);
      }
    } catch (error) { }
  };

  return (
    <div className="update-product-main">
      <p className="update-product">Update Product : {productId}</p>
      <p>Pname{productData?.name}</p>
      <hr />

      <div className="new-item-form">
        <Formik
          initialValues={addNewItemFormInitialValues}

          validationSchema={addNewItemValidationSchema}
          onSubmit={editProductFormSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <Form>
              <div className="field-container">
                <div className="field-input">
                  <label>Product Name :</label>
                  <Field type="text" id="name" name="name" />
                </div>

                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className="field-container">
                <div className="field-input">
                  <label>Category :</label>
                  <Field type="text" id="category" name="category" />
                </div>
                <ErrorMessage name="category" component="div" className="error" />
              </div>
              <div className="field-container">
                <div className="field-input">
                  <label>Material :</label>
                  <Field type="text" id="material" name="material" />
                </div>
                <ErrorMessage name="material" component="div" className="error" />
              </div>
              <div className="field-container">
                <div className="field-input">
                  <label>Price :</label>
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
                {variation.map((v, index) => (
                  <div key={index} className="form-container">
                    <div className="buttons">
                      <button
                        className="btn btn-success addNew-success-button"
                        onClick={() => handleAddSizeQuantity(index)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <div key={index} className="field-container">
                      <div className="field-input">
                        <Field type="text" name={`variation[${index}].color`} placeholder="Color" />
                      </div>
                      {v.sizeQuantityDTOS.map((sq, sqIndex) => (
                        <div key={sqIndex} className="field-input">
                          <Field
                            type="text"
                            name={`variation[${index}].sizeQuantityDTOS[${sqIndex}].size`}
                            placeholder="Size"
                          />
                          <Field
                            type="text"
                            name={`variation[${index}].sizeQuantityDTOS[${sqIndex}].qty`}
                            placeholder="Quantity"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="buttons">
                  <button
                    className="btn btn-info addNew-danger-button"
                    onClick={handleAddColor}
                    type="button"
                  >
                    + Add Variation
                  </button>
                </div>
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
    </div>
  );
};

export default SellerProductEdit;
