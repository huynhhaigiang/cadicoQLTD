import React, { useState, useEffect } from 'react';
import { get, put, del } from '../api/axiosClient';
import { format } from 'date-fns';
import { FaEye, FaEdit, FaTrashAlt, FaSearch, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

const statusConfig = {
  0: { color: 'bg-gray-100 text-gray-800', label: 'Bảng nháp' },
  1: { color: 'bg-amber-100 text-amber-800', label: 'Chờ TPhòng duyệt' },
  2: { color: 'bg-amber-100 text-amber-800', label: 'Chờ PGD duyệt' },
  3: { color: 'bg-amber-100 text-amber-800', label: 'Chờ GD duyệt' },
  4: { color: 'bg-green-100 text-green-800', label: 'Đã duyệt' },
  5: { color: 'bg-red-100 text-red-800', label: 'Từ chối' },
};

const ProjectManagement = () => {
  const navigate = useNavigate(); // Thêm hook này
  const [state, setState] = useState({
    constructions: [],
    projects: [],
    selectedCode: '',
    searchTerm: '',
    currentPage: 1,
    loading: false,
    error: null,
    successMessage: null,
    isModalOpen: false,
    editedProject: null,
    selectedConstruction: null,
    showDeleteConfirm: false,
    selectedDeleteId: null
  });

  const itemsPerPage = 10;
  const editFields = [
    { key: 'code', label: 'Mã dự án', type: 'text' },
    { key: 'name', label: 'Tên dự án', type: 'text' },
    { key: 'soHDKT', label: 'Số hợp đồng', type: 'text' },
    { key: 'giaTriHD', label: 'Giá trị hợp đồng', type: 'number' },
    { key: 'ngayHopDong', label: 'Ngày hợp đồng', type: 'date' },
    { key: 'batDauThiCong', label: 'Ngày bắt đầu', type: 'date' },
    { key: 'ketThucThiCong', label: 'Ngày kết thúc', type: 'date' },
    { key: 'thoiGianThiCongTheoHopDong', label: 'Thời gian thi công (ngày)', type: 'number' },
    { key: 'ngayQuyetToanNoiBo', label: 'Ngày quyết toán', type: 'date' },
    { key: 'thoiGianNghiemThuChuDauTu', label: 'Ngày nghiệm thu', type: 'date' },
    { key: 'ngayXuatHoaDon', label: 'Ngày xuất hóa đơn', type: 'date' },
    { key: 'ghiChu', label: 'Ghi chú', type: 'textarea' },
  ];

  useEffect(() => {
    fetchConstructions();
  }, []);

  const fetchConstructions = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await get('/CongTrinh/user-construction');
      setState(prev => ({ ...prev, constructions: response.data }));
    } catch (error) {
      handleError('Lỗi tải danh sách công trình');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchProjects = async (constructionId) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await get(`/CongTrinh/${constructionId}/projects`);
      setState(prev => ({
        ...prev,
        projects: response.data.dsPhuongAnThiCong || []
      }));
    } catch (error) {
      handleError('Lỗi tải danh sách dự án');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleError = (message) => {
    setState(prev => ({
      ...prev,
      error: message,
      successMessage: null
    }));
    setTimeout(() => setState(prev => ({ ...prev, error: null })), 5000);
  };

  const handleSuccess = (message) => {
    setState(prev => ({
      ...prev,
      successMessage: message,
      error: null
    }));
    setTimeout(() => setState(prev => ({ ...prev, successMessage: null })), 3000);
  };

  const handleConstructionChange = async (e) => {
    const code = e.target.value;
    const selected = state.constructions.find(c => c.code === code);

    setState(prev => ({
      ...prev,
      selectedCode: code,
      currentPage: 1,
      selectedConstruction: selected,
      projects: [],
      error: null,
      successMessage: null
    }));

    if (selected) await fetchProjects(selected.id);
  };

  const handleEdit = (project) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      editedProject: { ...project },
      error: null,
      successMessage: null
    }));
  };

  const handleSaveProject = async () => {
    try {
      await put(`/PhuongAnThiCong/${state.editedProject.id}`, state.editedProject);
      handleSuccess('✅ Cập nhật dự án thành công!');
      await fetchProjects(state.selectedConstruction.id);
      setState(prev => ({ ...prev, isModalOpen: false }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Lỗi cập nhật dự án';
      handleError(`❌ ${errorMessage}`);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await del(`/PhuongAnThiCong/${state.selectedDeleteId}`);
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== prev.selectedDeleteId),
        showDeleteConfirm: false,
        successMessage: '✅ Xóa dự án thành công!'
      }));
      setTimeout(() => setState(prev => ({ ...prev, successMessage: null })), 3000);
    } catch (error) {
      handleError('❌ Lỗi xóa dự án: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
      setState(prev => ({ ...prev, showDeleteConfirm: false }));
    }
  };

  const filteredProjects = state.projects.filter(project =>
    project.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    project.code.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage
  );

  const TableRow = ({ project }) => (

    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 border-b border-gray-100"
    >
      <td className="px-6 py-4 font-medium text-gray-900">{project.code}</td>
      <td className="px-6 py-4 max-w-xs truncate">{project.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {format(new Date(project.batDauThiCong), 'dd/MM/yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {format(new Date(project.ketThucThiCong), 'dd/MM/yyyy')}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
          ${statusConfig[project.status]?.color}`}>
          {statusConfig[project.status]?.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-4 text-gray-600">
          <button
            onClick={() => handleEdit(project)}
            className="hover:text-blue-600 transition-colors"
            aria-label="Chỉnh sửa"
          >
            <FaEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setState(prev => ({
              ...prev,
              showDeleteConfirm: true,
              selectedDeleteId: project.id
            }))}
            className="hover:text-red-600 transition-colors"
            aria-label="Xóa"
          >
            <FaTrashAlt className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/projectmanagement/${project.id}/cost`)} // Sửa đường dẫn này
            className="hover:text-green-600 transition-colors"
            aria-label="Xem chi tiết"
          >
            <FaEye className="w-5 h-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  const DeleteConfirmModal = () => (
    <AnimatePresence>
      {state.showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Xác nhận xóa</h3>
              <p className="mt-2 text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa dự án này? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setState(prev => ({ ...prev, showDeleteConfirm: false }))}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý tiến độ dự án</h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Thanh tìm kiếm */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            {/* Thanh chọn */}
            <select
              value={state.selectedCode}
              onChange={handleConstructionChange}
              className="w-full md:w-96 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn công trình</option>
              {state.constructions.map(construction => (
                <option key={construction.id} value={construction.code}>
                  {construction.code} - {construction.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Mã Dự Án', 'Tên Dự Án', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái', 'Thao tác'].map(
                    (header, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {state.loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="p-4">
                          <Skeleton height={24} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : state.error ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-red-500">
                      {state.error}
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {paginatedProjects.map(project => (
                      <TableRow key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProjects.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị {paginatedProjects.length} trong tổng {filteredProjects.length} dự án
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(filteredProjects.length / itemsPerPage) }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setState(prev => ({ ...prev, currentPage: i + 1 }))}
                      className={`px-3 py-1 rounded-md ${state.currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                        }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {state.isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Chỉnh sửa dự án</h2>
                  <button
                    onClick={() => setState(prev => ({ ...prev, isModalOpen: false }))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editFields.map(({ key, label, type }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        {type === 'textarea' ? (
                          <textarea
                            value={state.editedProject?.[key] || ''}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              editedProject: {
                                ...prev.editedProject,
                                [key]: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        ) : (
                          <input
                            type={type}
                            value={state.editedProject?.[key] || ''}
                            onChange={(e) => {
                              const value = type === 'number'
                                ? Number(e.target.value)
                                : e.target.value;

                              setState(prev => ({
                                ...prev,
                                editedProject: {
                                  ...prev.editedProject,
                                  [key]: value
                                }
                              }));
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            min={type === 'number' ? 0 : undefined}
                            onKeyDown={(e) => {
                              if (type === 'number' && e.key === '-') {
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setState(prev => ({ ...prev, isModalOpen: false }))}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal />

        {/* Notifications */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <FaTimes className="flex-shrink-0" />
              <span>{state.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.successMessage && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <FiCheck className="flex-shrink-0" />
              <span>{state.successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectManagement;