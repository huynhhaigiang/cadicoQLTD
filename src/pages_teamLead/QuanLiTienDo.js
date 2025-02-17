import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { get } from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const ProjectStatus = ({ status }) => {
  const statusColors = {
    'Đã duyệt': 'bg-green-500',
    'Từ chối': 'bg-red-500',
    'Chờ duyệt': 'bg-yellow-500'
  };
  return (
    <div className="relative flex items-center justify-center">
      <span className={`status-badge text-white ${statusColors[status] || 'bg-gray-500'} px-2 py-1 rounded-full`}>
        {status || 'Không xác định'}
      </span>
    </div>
  );
};

const ProjectManagementStack = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get('/ProjectTask/user-tasks');
      console.log(response);
      const mappedProjects = response.data.map(project => ({
        id: project.id,
        name: project.project?.name || 'Không có tên',
        tongKl: project.tongKl,
        hanMucCongViec: project.hanMucCongViec || 'N/A',
        time: `${project.ngayBatDau || 'N/A'} - ${project.ngayKetThuc || 'N/A'}`,
        status: project.status || 'Chờ duyệt',
        originalData: project
      }));

      setProjects(mappedProjects);
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi tải dữ liệu';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại';
            break;
          case 403:
            errorMessage = 'Bạn không có quyền truy cập dữ liệu này';
            break;
          case 404:
            errorMessage = 'Không tìm thấy dữ liệu dự án';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/progressreportpage/${project.id}`);
  };

  const ProjectTable = ({ projects, onProjectClick }) => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên công trình</th>
            <th className="px-4 py-2">Hạn mục công việc</th>
            <th className="px-4 py-2">Tổng Khối Lượng</th>
            <th className="px-4 py-2 text-center">Thời gian</th>
            <th className="px-4 py-2" style={{ width: '150px' }}>Tình trạng</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{project.name}</td>
              <td className="px-4 py-2">{project.hanMucCongViec}</td>
              <td className="px-4 py-2">{project.tongKl}</td>
              <td className="px-4 py-2 text-center">{project.time}</td>
              <td className="px-4 py-2">
                <ProjectStatus status={project.status} />
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => onProjectClick(project)}
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                  title="Chỉnh sửa"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-300"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý tiến độ dự án</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded pl-8 pr-4 py-2"
          />
          <Search size={20} className="absolute left-2 top-2 text-gray-500" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-6 text-gray-600">
          Hiện chưa có dữ liệu dự án nào.
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <ProjectTable
          projects={projects.filter((project) =>
            project.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onProjectClick={handleProjectClick}
        />
      )}
    </div>
  );
};

export default ProjectManagementStack;
