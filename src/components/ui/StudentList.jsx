


// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useCreateStudent } from '../../hooks/useCreateStudent';
import { useFetchStudents } from '../../hooks/useFetchStudents';
import { useDeleteStudent } from '../../hooks/useDeleteStudent';
import { useUpdateStudent } from '../../hooks/useUpdateStudent';

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { createStudent, loading: creating, error: createError, success } = useCreateStudent();
  const { students, loading: fetching, error: fetchError, refetch } = useFetchStudents();
  const { deleteStudent, loading: deleting } = useDeleteStudent();
  const { updateStudent, loading: updating } = useUpdateStudent();

  // edit modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    createStudent({ username, password }).then(() => refetch && refetch());
  };

  useEffect(() => {
    if (success) {
      setUsername('');
      setPassword('');
    }
  }, [success]);

  const handleDelete = async (id, usernameToDelete) => {
    const ok = window.confirm(`Delete student "${usernameToDelete}" ? This action cannot be undone.`);
    if (!ok) return;

    const res = await deleteStudent(id);
    if (res.success) {
      alert('Student deleted');
      refetch && refetch();
    } else {
      alert('Failed to delete student');
    }
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setEditUsername(student.username || '');
    setEditPassword(''); // blank: only fill if admin wants to change
  };

  const closeEdit = () => {
    setEditingStudent(null);
    setEditUsername('');
    setEditPassword('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const payload = {};
    if (editUsername && editUsername !== editingStudent.username) payload.username = editUsername;
    if (editPassword) payload.password = editPassword;

    if (Object.keys(payload).length === 0) {
      alert('No changes to update');
      return;
    }

    const res = await updateStudent(editingStudent._id, payload);
    if (res.success) {
      alert('Student updated');
      closeEdit();
      refetch && refetch();
    } else {
      alert('Failed to update student');
    }
  };

  return (
    <>
      <style>{/* keep your styles, plus small additions for modal/buttons */}
        {`
          .dashboard-section {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 1.5rem;
          }
          .form-row {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            align-items: center;
          }
          .form-row input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            background: #4a6cf7;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          }
          .btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
          }
          .students-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          .students-table th,
          .students-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          .students-table th {
            background: #f8fafc;
            font-weight: 600;
          }
          .error { color: #e53e3e; margin: 0.5rem 0; }
          .success { color: #38a169; margin: 0.5rem 0; }
          .small-btn { padding: 0.35rem 0.6rem; font-size: 0.9rem; border-radius: 6px; cursor: pointer; border: none; }
          .edit-btn { background: #4a90f2; color: white; }
          .delete-btn { background: #e53e3e; color: white; }
          /* modal simple */
          .modal { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.5); z-index:1000; }
          .modal-content { background:white; padding:1rem; border-radius:8px; width: 90%; max-width: 480px; box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        `}
      </style>

      <div className="dashboard-section">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Student Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Student Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={creating} className="btn">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
          {createError && <div className="error">{createError}</div>}
          {success && <div className="success">Student created successfully!</div>}
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Students ({students.length})</h2>
        {fetchError && <div className="error">{fetchError}</div>}
        {fetching ? (
          <p>Loading students...</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Reg. Number</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No students found</td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{student.registrationNumber}</td>
                    <td>{student.username}</td>
                    <td>{student.plainPassword || '—'}</td>
                    <td>
                      <button className="small-btn edit-btn" onClick={() => openEdit(student)} style={{marginRight:8}}>
                        Edit
                      </button>
                      <button
                        className="small-btn delete-btn"
                        onClick={() => handleDelete(student._id, student.username)}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Student</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display:'block', fontSize: 13, marginBottom: 6 }}>Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius:6, border:'1px solid #ddd' }}
                  required
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display:'block', fontSize: 13, marginBottom: 6 }}>Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius:6, border:'1px solid #ddd' }}
                />
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                <button type="button" className="small-btn" onClick={closeEdit}>Cancel</button>
                <button type="submit" className="small-btn edit-btn" disabled={updating}>
                  {updating ? 'Updating...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
