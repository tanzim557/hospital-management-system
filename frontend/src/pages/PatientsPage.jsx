import { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import api from '../api/axios';

/**
 * PatientsPage
 *
 * Lists all patients with search functionality.
 * Accessible by: admin, doctor, nurse, receptionist.
 */
export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (searchTerm = '') => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await api.get('/patients', { params });
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(search);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => row.user?.name || 'N/A',
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => row.user?.email || 'N/A',
    },
    { key: 'gender', label: 'Gender', render: (row) => row.gender || '—' },
    { key: 'blood_group', label: 'Blood Group', render: (row) => row.blood_group || '—' },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => row.user?.phone || '—',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and view patient records</p>
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            className="form-input"
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          emptyMessage="No patients found."
        />
      )}
    </div>
  );
}
