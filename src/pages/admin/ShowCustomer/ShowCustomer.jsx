import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '~/components/Admin/Box/Box';
import FormSearch from '~/components/Admin/FormSearch/FormSearch';
import HeadingBreadCrumb from '~/components/Admin/HeadingBreadCrumb/HeadingBreadCrumb';
import TextQuantity from '~/components/Admin/TextQuantity/TextQuantity';
import Button from '~/components/Button/Button';
import DataTable from '~/components/DataTable/DataTable';
import ModalDialog from '~/components/ModalDialog/ModalDialog';
import Pagination from '~/components/Pagination/Pagination';
import { useDebounce } from '~/hooks/useDebounce';
import UserService from '~/services/UserService';

const ShowCustomer = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [response, setResponse] = useState({});
  const [rows, setRows] = useState([]);
  const [keys, setKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const user = useSelector((state) => state.user);

  const searchDebounce = useDebounce(search, 1000);
  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const fetchData = async (payload) => {
    const res = await UserService.getUsers(payload, user.accessToken, dispatch);
    if (res.status === 'OK') {
      const rows = res.data.map((user) => ({
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        province: user.province,
        isLocked: user.isLocked,
      }));
      setRows(rows);
      setResponse(res);
      if (rows.length) setKeys(Object.keys(rows[0]));
    }
  };

  useEffect(() => {
    fetchData({ page: 1, search: searchDebounce });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchDebounce]);

  const handleOpenDelete = (id) => {
    setOpen(true);
    setId(id);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await UserService.deleteUser(id, user.accessToken, dispatch);
    if (res) fetchData({ page, search: searchDebounce });
  };

  return (
    <div className='customers'>
      <HeadingBreadCrumb>Quản lý khách hàng</HeadingBreadCrumb>
      <Box>
        <div className='search-head'>
          <FormSearch
            placeholder='Nhập tên khách hàng cần tìm kiếm'
            value={search}
            handleOnChange={handleOnChangeSearch}
            disabled={!searchDebounce}
          />
          <Button secondary className='btn-add' to='/admin/customers/add'>
            Bổ sung
          </Button>
        </div>
        <TextQuantity
          quantity={response.totalUsers ?? 0}
          text='khách hàng'
          totalPage={response.totalPage ?? 0}
          page={page}
          pageSize={response.limit ?? 0}
        />

        <DataTable
          rows={rows}
          head={[
            'Tên khách hàng',
            'Số điện thoại',
            'Email',
            'Địa chỉ',
            'Tỉnh/thành phố',
            'Bị khoá?',
          ]}
          keys={keys}
          handleOpenDelete={handleOpenDelete}
        />
        <Pagination
          pageCount={response.totalPage ?? 0}
          onClickPageItem={(value) => setPage(value.selected + 1)}
        ></Pagination>
      </Box>
      <ModalDialog
        desc={'Bạn có muốn khách hàng này không ?'}
        handleClose={() => setOpen(false)}
        handleDelete={handleDelete}
        open={open}
      ></ModalDialog>
    </div>
  );
};

export default ShowCustomer;