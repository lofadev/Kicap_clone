import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './DataTable.scss';
import PropTypes from 'prop-types';

export default function DataTable({ head, rows, keys, handleOpenDelete }) {
  const resKeys = keys?.filter((key) => key !== 'id');

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, fontSize: '1.6rem' }} aria-label='simple table'>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'var(--blue)', color: 'var(--white)' }}>
            {head?.map((item) => (
              <TableCell key={item} sx={{ color: 'white' }}>
                {item}
              </TableCell>
            ))}
            <TableCell sx={{ color: 'white', width: '100px' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {resKeys.map((key, index) => (
                <TableCell key={index}>{row[key]}</TableCell>
              ))}
              <TableCell className='btn-actions'>
                <Link
                  to={`update/${row.id}`}
                  style={{ color: 'var(--blue)', display: 'inline-block' }}
                >
                  <FaEdit />
                </Link>
                <button onClick={() => handleOpenDelete(row.id)} style={{ color: 'var(--red)' }}>
                  <FaTimes />
                </button>
              </TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ textAlign: 'center' }} colSpan={head.length + 1}>
                Không tìm kết kết quả phù hợp hoặc dữ liệu không tồn tại.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

DataTable.propTypes = {
  head: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  keys: PropTypes.array.isRequired,
};
