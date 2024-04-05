import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '~/components/Admin/Box/Box';
import ButtonAction from '~/components/Admin/ButtonAction/ButtonAction';
import HeadingBreadCrumb from '~/components/Admin/HeadingBreadCrumb/HeadingBreadCrumb';
import DataTable from '~/components/DataTable/DataTable';
import FormGroup from '~/components/FormGroup/FormGroup';
import Input from '~/components/FormGroup/Input/Input';
import InputNumber from '~/components/FormGroup/InputNumber/InputNumber';
import SelectOptions from '~/components/Select/Select';
import CategoryService from '~/services/CategoryService';
import ProductService from '~/services/ProductService';
import SupplierService from '~/services/SupplierService';
import { ProductSchema } from '~/validate/YupSchema';

const UpdateProduct = () => {
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      brand: '',
      categoryID: '',
      supplierID: '',
      stock: 1,
      price: 0,
      discount: 0,
    },
    validationSchema: ProductSchema,
    onSubmit: async (payload, { setSubmitting, resetForm }) => {
      const res = await ProductService.createProduct(payload, dispatch);
      if (res.status === 'OK') {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, suppliersRes] = await Promise.all([
        CategoryService.getCategorys({}, dispatch),
        SupplierService.getSuppliers({}, dispatch),
      ]);
      if (categoriesRes.status === 'OK') {
        const categories = categoriesRes.data.map((category) => {
          return {
            id: category._id,
            name: category.categoryName,
          };
        });
        setCategories(categories);
      }
      if (suppliersRes.status === 'OK') {
        const suppliers = suppliersRes.data.map((supplier) => {
          return {
            id: supplier._id,
            name: supplier.name,
          };
        });
        setSuppliers(suppliers);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='product-add'>
      <HeadingBreadCrumb>Bổ sung sản phẩm</HeadingBreadCrumb>

      <Box title='Thông tin sản phẩm'>
        <Input
          labelName='Tên sản phẩm'
          name='name'
          required
          formik={formik}
          placeholder='Nhập tên sản phẩm'
        />
        <Input
          labelName='Thương hiệu'
          name='brand'
          required
          formik={formik}
          placeholder='Nhập thương hiệu của sản phẩm'
        />
        <SelectOptions
          labelName='Loại hàng'
          required
          options={categories}
          optionDefault='--- Chọn loại hàng ---'
          name='categoryID'
          formik={formik}
        ></SelectOptions>
        <SelectOptions
          labelName='Nhà cung cấp'
          required
          options={suppliers}
          optionDefault='--- Chọn nhà cung cấp ---'
          name='supplierID'
          formik={formik}
        ></SelectOptions>
        <InputNumber labelName='Số lượng' required formik={formik} name='stock' min={1} />
        <InputNumber labelName='Giá' required formik={formik} name='price' min={0} />
        <InputNumber labelName='Giảm giá (%)' required formik={formik} name='discount' min={0} />
        <FormGroup labelName='Mô tả' name='description'>
          <ReactQuill
            placeholder='Nhập mô tả sản phẩm'
            theme='snow'
            value={value}
            onChange={setValue}
          />
        </FormGroup>

        <ButtonAction
          to='/admin/products'
          handleSave={formik.handleSubmit}
          isSubmitting={formik.isSubmitting}
        ></ButtonAction>
      </Box>

      <Box title='Thư mục ảnh'>
        <DataTable
          head={['Ảnh', 'Mô tả', 'Thứ tự hiển thị', 'Ẩn ảnh']}
          rows={[]}
          keys={[]}
          action={<Link to='/admin/product/image/add'>Thêm</Link>}
        ></DataTable>
      </Box>
    </div>
  );
};

export default UpdateProduct;