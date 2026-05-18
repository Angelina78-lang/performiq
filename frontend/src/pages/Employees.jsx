import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import EmployeeTable from '../components/employees/EmployeeTable.jsx';
import SearchFilter from '../components/employees/SearchFilter.jsx';
import EmployeeForm from '../components/employees/EmployeeForm.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const Employees = ({ onMenuToggle }) => {
  const { toast } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/employees');
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [toast]);

  const handleSearch = async (term) => {
    if (!term) {
      fetchEmployees();
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/employees/search', {
        params: { name: term },
      });
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterDept = async (dept) => {
    if (!dept) {
      fetchEmployees();
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/employees/search', {
        params: { department: dept },
      });
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterScore = async (score) => {
    if (!score) {
      fetchEmployees();
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/employees/search', {
        params: { minScore: score },
      });
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (payload) => {
    setFormLoading(true);
    try {
      if (editingEmployee) {
        await axiosInstance.put(`/employees/${editingEmployee._id}`, payload);
        toast.success('Employee updated successfully');
      } else {
        await axiosInstance.post('/employees', payload);
        toast.success('Employee created successfully');
      }
      fetchEmployees();
      setShowFormModal(false);
      setEditingEmployee(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save employee';
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowFormModal(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const handleDeleteExecute = async () => {
    const { id } = confirmDelete;
    try {
      await axiosInstance.delete(`/employees/${id}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleViewAI = (id) => {
    navigate(`/ai-recommendations?employeeId=${id}`);
  };

  return (
    <>
      <Navbar pageTitle="Employees" pageSubtitle="Manage and view employee records" onMenuToggle={onMenuToggle} />

      <div className="page-content">
        <div className="section-head">
          <div>
            <h1>Employee Directory</h1>
            <p>{employees.length} employees in the system</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setShowFormModal(true);
            }}
          >
            + Add Employee
          </button>
        </div>

        <SearchFilter
          onSearch={handleSearch}
          onFilterDept={handleFilterDept}
          onFilterScore={handleFilterScore}
          loading={loading}
        />

        {loading ? (
          <Loader />
        ) : employees.length > 0 ? (
          <div className="card">
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onViewAI={handleViewAI}
            />
          </div>
        ) : (
          <EmptyState
            icon="👤"
            title="No Employees Yet"
            message="Start by adding your first employee to the system."
            action={
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingEmployee(null);
                  setShowFormModal(true);
                }}
              >
                + Add Your First Employee
              </button>
            }
          />
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-head">
              <h3>{editingEmployee ? '✏️ Edit Employee' : '➕ Create Employee'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowFormModal(false);
                  setEditingEmployee(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <EmployeeForm
                initialData={editingEmployee}
                onSubmit={handleSubmitForm}
                onCancel={() => {
                  setShowFormModal(false);
                  setEditingEmployee(null);
                }}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Employee"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous
          onConfirm={handleDeleteExecute}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
};

export default Employees;
