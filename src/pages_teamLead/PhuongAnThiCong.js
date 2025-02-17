import React, { useState, useEffect } from 'react';
import { get, post } from '../api/axiosClient'; // Import axiosClient đã cấu hình
import "react-datepicker/dist/react-datepicker.css";

const ProjectForm = ({ onCreate }) => {
  const [projectData, setProjectData] = useState({
    projectCode: '',
    projectName: '',
    projectCustomer: '',
    contractCode: '',
    contractName: '',
    contractNumber: '',
    contractValue: '',
    contractDate: '',
    startDate: '',
    endDate: '',
    constructionTimeline: '',
    settlementDate: '',
    acceptanceDate: '',
    invoiceDate: '', 
    note: '',
  });

  const [projects, setProjects] = useState([]);
  const [notification, setNotification] = useState(null);

  // Fetch dự án khi component được render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await get('/Congtrinh/all');
        setProjects(projectResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setNotification({ type: 'error', message: 'Không thể tải dữ liệu công trình. Vui lòng thử lại!' });
      }
    };

    fetchData();
  }, []);

  // Handle thay đổi mã công trình và điền tự động thông tin
  const handleProjectCodeChange = (e) => {
    const selectedProjectCode = e.target.value;
    const selectedProject = projects.find((project) => project.code === selectedProjectCode);
    setProjectData((prevData) => ({
      ...prevData,
      projectCode: selectedProjectCode,
      projectName: selectedProject ? selectedProject.name : '',
      projectCustomer: selectedProject && selectedProject.chuDauTu ? selectedProject.chuDauTu.name : '',
    }));
  };

  // Handle thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin hợp lệ trước khi gửi dữ liệu
    if (!projectData.projectCode || !projectData.contractNumber || !projectData.contractValue || isNaN(parseFloat(projectData.contractValue))) {
      setNotification({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin hợp lệ!' });
      return;
    }

    const selectedProject = projects.find((project) => project.code === projectData.projectCode);

    // Dữ liệu gửi đi cho API
    const data = {
      code: projectData.contractCode,
      name: projectData.contractName,
      soHDKT: projectData.contractNumber,
      giaTriHD: parseFloat(projectData.contractValue),  // Chuyển đổi thành số
      ngayHopDong: projectData.contractDate || null,
      batDauThiCong: projectData.startDate || null,
      ketThucThiCong: projectData.endDate || null,
      thoiGianThiCongTheoHopDong: projectData.constructionTimeline,
      ngayQuyetToanNoiBo: projectData.settlementDate || null,
      thoiGianNghiemThuChuDauTu: projectData.acceptanceDate || null,
      ngayXuatHoaDon: projectData.invoiceDate || null,
      ghiChu: projectData.note,
      congTrinhId: selectedProject.id, // Sử dụng project.id làm constructionId
    };

    try {
      console.log(data);
      const response = await post('/PhuongAnThiCong', data);
      console.log('Dự án đã được tạo:', response.data);
      setNotification({ type: 'success', message: 'Dự án đã được tạo thành công!' });
      if (onCreate) onCreate(response.data); // Nếu có callback từ parent, gọi callback
    } catch (error) {
      console.error('Error creating project', error);
      setNotification({ type: 'error', message: 'Lỗi khi tạo dự án. Vui lòng thử lại!' });
    }
  };

  // Handle reset form
  const handleReset = () => {
    setProjectData({
      projectCode: '',
      projectName: '',
      projectCustomer: '',
      contractCode: '',
      contractName: '',
      customerCode: '',
      contractNumber: '',
      contractValue: '',
      contractDate: '',
      startDate: '',
      endDate: '',
      constructionTimeline: '',
      settlementDate: '',
      acceptanceDate: '',
      invoiceDate: '',
      note: '',
    });
    setNotification(null);
  };

  return (
    <div className="max-w-8xl mx-auto mt-10 p-8 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-left">Thông tin dự án</h1>

      {notification && (
        <div className={`p-4 mb-4 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">Mã công trình</label>
            <select
              name="projectCode"
              value={projectData.projectCode}
              onChange={handleProjectCodeChange}
              className="mt-1 p-2 border w-full rounded-md"
            >
              <option value="" style={{ color: 'gray', opacity: 0.6 }}>
                Chọn công trình
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.code}>
                  {project.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Tên công trình</label>
            <input
              type="text"
              name="projectName"
              value={projectData.projectName}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              readOnly
              placeholder="Tên công trình sẽ được tự động điền khi chọn mã công trình"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Tên chủ đầu tư</label>
            <input
              type="text"
              name="projectCustomer"
              value={projectData.projectCustomer}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              readOnly
              placeholder="Tên chủ đầu tư sẽ được tự động điền khi chọn mã công trình"
            />
          </div>
        </div>

        {/* Các mục còn lại */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Số phương án</label>
            <input
              type="text"
              name="contractCode"
              value={projectData.contractCode}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
              placeholder="Nhập số phương án"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên phương án</label>
            <input
              type="text"
              name="contractName"
              value={projectData.contractName}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
              placeholder="Nhập tên phương án"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hợp đồng kinh tế</label>
            <input
              type="text"
              name="contractNumber"
              value={projectData.contractNumber}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
              placeholder="Nhập Số hợp đồng khách hàng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá trị hợp đồng</label>
            <input
              type="text"
              name="contractValue"
              value={projectData.contractValue}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
              placeholder="Nhập giá trị hợp đồng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày hợp đồng</label>
            <input
              type="date"
              name="contractDate"
              value={projectData.contractDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6">Tiến độ dự án</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian thi công theo hợp đồng "ngày"</label>
            <input
              type="text"
              name="constructionTimeline"
              value={projectData.constructionTimeline}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              required
              placeholder="Nhập số thời gian thi công"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu thi công</label>
            <input
              type="date"
              name="startDate"
              value={projectData.startDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày kết thúc thi công</label>
            <input
              type="date"
              name="endDate"
              value={projectData.endDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6">Xử lý các trạng thái</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quyết toán nội vụ</label>
            <input
              type="date"
              name="settlementDate"
              value={projectData.settlementDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nghiệm thu</label>
            <input
              type="date"
              name="acceptanceDate"
              value={projectData.acceptanceDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày xuất hóa đơn</label>
            <input
              type="date"
              name="invoiceDate"
              value={projectData.invoiceDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              value={projectData.note}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded-md"
              rows="4"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={handleReset} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Reset
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
