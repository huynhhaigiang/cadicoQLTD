import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MaterialRequestForm = () => {
  const { phuongAnThiCongId } = useParams();
  const [projectInfo, setProjectInfo] = useState({
    projectCode: '',
    constructionOption: '',
    projectName: 'Xây dựng tuyến truyền dẫn cáp quang cho các trạm giai đoạn 2023 - 2024',
    projectManager: 'Lê Hoàng Tư',
  });

  const projectCodes = [
    '17.CQ.KQ.24',
    '18.CQ.KQ.25',
    '19.CQ.KQ.26',
  ];

  const constructionOptions = [
    'Lắp đặt cáp quang trên cột',
    'Đào rãnh cáp quang',
    'Treo cáp quang',
  ];

  const [newMaterial, setNewMaterial] = useState({
    materialName: '',
    specification: '',
    unit: '',
    designQuantity: '',
    requestQuantity: '',
    cumulativeQuantity: '',
    note: ''
  });

  const [materials, setMaterials] = useState([
    {
      materialName: 'Kẹp 2 rãnh 3 lỗ',
      specification: '2 rãnh 3 lỗ',
      unit: 'Bộ',
      designQuantity: '1,727',
      requestQuantity: '1,380',
      cumulativeQuantity: '1,380',
      note: 'Lắp 80% KL TK'
    },
    {
      materialName: 'Bulong 14×300',
      specification: '14×300',
      unit: 'Bộ',
      designQuantity: '1,727',
      requestQuantity: '1,380',
      cumulativeQuantity: '1,380',
      note: ''
    }
  ]);

  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProjectInfoChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleAddMaterial = () => {
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
    resetForm();
  };

  const handleUpdateMaterial = () => {
    if (selectedMaterialIndex !== null) {
      const updatedMaterials = [...materials];
      updatedMaterials[selectedMaterialIndex] = newMaterial;
      setMaterials(updatedMaterials);
      resetForm();
    }
  };

  const handleDeleteMaterial = () => {
    if (selectedMaterialIndex !== null) {
      const updatedMaterials = materials.filter((_, index) => index !== selectedMaterialIndex);
      setMaterials(updatedMaterials);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewMaterial({
      materialName: '',
      specification: '',
      unit: '',
      designQuantity: '',
      requestQuantity: '',
      cumulativeQuantity: '',
      note: ''
    });
    setSelectedMaterialIndex(null);
  };

  const handleRowClick = (index) => {
    setSelectedMaterialIndex(index);
    setNewMaterial(materials[index]);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Phần đề nghị vật tư</h1>

      {/* Mã dự án */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mã dự án:</label>
          <select
            name="projectCode"
            value={projectInfo.projectCode}
            onChange={handleProjectInfoChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="">Chọn mã dự án</option>
            {projectCodes.map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {/* Phương án thi công */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phương án thi công:</label>
          <select
            name="constructionOption"
            value={projectInfo.constructionOption}
            onChange={handleProjectInfoChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="">Chọn phương án thi công</option>
            {constructionOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Thông tin dự án */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tên dự án:</label>
        <input
          type="text"
          value={projectInfo.projectName}
          readOnly
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
        />
      </div>

      {/* Form nhập vật tư */}
      <div className="mb-4 bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">
          {selectedMaterialIndex !== null ? 'Sửa vật tư' : 'Thêm vật tư mới'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên vật tư:</label>
            <input
              type="text"
              name="materialName"
              value={newMaterial.materialName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quy cách:</label>
            <input
              type="text"
              name="specification"
              value={newMaterial.specification}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Đơn vị tính:</label>
            <input
              type="text"
              name="unit"
              value={newMaterial.unit}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">KL thiết kế:</label>
            <input
              type="text"
              name="designQuantity"
              value={newMaterial.designQuantity}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">KL đề nghị:</label>
            <input
              type="text"
              name="requestQuantity"
              value={newMaterial.requestQuantity}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">KL lũy kế:</label>
            <input
              type="text"
              name="cumulativeQuantity"
              value={newMaterial.cumulativeQuantity}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú:</label>
            <input
              type="text"
              name="note"
              value={newMaterial.note}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
        </div>
        <div className="mt-4">
          {selectedMaterialIndex === null ? (
            <>
              <button
                onClick={handleAddMaterial}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Thêm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
              >
                Quay lại
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdateMaterial}
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cập nhật
              </button>
              <button
                onClick={handleDeleteMaterial}
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Xóa
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Quay lại
              </button>
            </>
          )}
        </div>
      </div>

      {/* Danh sách vật tư */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Tên vật tư</th>
              <th className="px-4 py-2 border">Quy cách</th>
              <th className="px-4 py-2 border">Đơn vị tính</th>
              <th className="px-4 py-2 border">KL thiết kế</th>
              <th className="px-4 py-2 border">KL đề nghị</th>
              <th className="px-4 py-2 border">KL lũy kế</th>
              <th className="px-4 py-2 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(index)}
              >
                <td className="px-4 py-2 border">{material.materialName}</td>
                <td className="px-4 py-2 border">{material.specification}</td>
                <td className="px-4 py-2 border">{material.unit}</td>
                <td className="px-4 py-2 border">{material.designQuantity}</td>
                <td className="px-4 py-2 border">{material.requestQuantity}</td>
                <td className="px-4 py-2 border">{material.cumulativeQuantity}</td>
                <td className="px-4 py-2 border">{material.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialRequestForm;
