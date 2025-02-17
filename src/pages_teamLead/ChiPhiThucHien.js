import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiDollarSign } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const jobCategories = ['Xây dựng', 'Điện nước', 'Hoàn thiện'];
const taskCategories = {
  'Xây dựng': ['Móng', 'Khung', 'Tường'],
  'Điện nước': ['Ống nước', 'Dây điện', 'Thiết bị vệ sinh'],
  'Hoàn thiện': ['Sơn', 'Gạch', 'Trần'],
};

const executors = ['Đội xây dựng A', 'Đội điện nước B', 'Nhà thầu C'];

const CostManagement = () => {
  const { phuongAnThiCongId } = useParams(); // Thêm dòng này
  const [showDialog, setShowDialog] = useState(false);
  const [currentCostType, setCurrentCostType] = useState('');
  const [costItems, setCostItems] = useState({
    'Chi phí nhân công': [],
    'Chi phí khác': [],
  });
  const [newCostItem, setNewCostItem] = useState({
    content: '',
    jobCategory: '',
    taskCategory: '',
    executor: '',
    unit: '',
    quantity: '',
    unitPrice: '',
    totalPrice: '',
    note: '',
  });
  const [editingIndex, setEditingIndex] = useState(-1);

  // Xử lý mở dialog
  const handleAddCost = (type) => {
    setCurrentCostType(type);
    setShowDialog(true);
    setNewCostItem({
      content: '',
      jobCategory: '',
      taskCategory: '',
      executor: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
      note: '',
    });
    setEditingIndex(-1);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
    setNewCostItem({
      content: '',
      jobCategory: '',
      taskCategory: '',
      executor: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
      note: '',
    });
    setEditingIndex(-1);
  };

  // Lưu chi phí
  const handleSaveCost = () => {
    if (!validateForm()) return;

    const updatedItem = {
      ...newCostItem,
      quantity: Number(newCostItem.quantity),
      unitPrice: Number(newCostItem.unitPrice),
      totalPrice: Number(newCostItem.totalPrice)
    };

    setCostItems(prev => {
      const items = [...prev[currentCostType]];
      if (editingIndex > -1) {
        items[editingIndex] = updatedItem;
      } else {
        items.push(updatedItem);
      }
      return { ...prev, [currentCostType]: items };
    });

    handleCloseDialog();
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ['content', 'jobCategory', 'taskCategory', 'executor', 'unit', 'quantity', 'unitPrice', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !newCostItem[field]);

    if (missingFields.length > 0) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return false;
    }
    return true;
  };

  // Chỉnh sửa
  const handleEditCost = (index, costType) => {
    const item = costItems[costType][index];
    setNewCostItem(item);
    setCurrentCostType(costType);
    setEditingIndex(index);
    setShowDialog(true);
  };

  // Xóa
  const handleDeleteCost = (index, costType) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setCostItems(prev => ({
        ...prev,
        [costType]: prev[costType].filter((_, i) => i !== index)
      }));
    }
  };

  // Thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCostItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FiDollarSign className="text-blue-600" />
            Quản lý Chi phí Dự án
          </h1>
          <p className="text-gray-600 mt-2">Quản lý toàn bộ chi phí thực hiện dự án</p>
        </div>

        {/* Phần chi phí nhân công */}
        <CostSection
          title="Chi phí Nhân công"
          type="Chi phí nhân công"
          items={costItems['Chi phí nhân công']}
          onAdd={handleAddCost}
          onEdit={handleEditCost}
          onDelete={handleDeleteCost}
        />

        {/* Phần chi phí khác */}
        <CostSection
          title="Chi phí Khác"
          type="Chi phí khác"
          items={costItems['Chi phí khác']}
          onAdd={handleAddCost}
          onEdit={handleEditCost}
          onDelete={handleDeleteCost}
        />

        {/* Dialog form */}
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-semibold">
                  {editingIndex > -1 ? 'Chỉnh sửa' : 'Thêm mới'} {currentCostType}
                </h3>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nội dung công việc */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nội dung công việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="content"
                      value={newCostItem.content}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nội dung công việc"
                    />
                  </div>

                  {/* Công việc */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jobCategory"
                      value={newCostItem.jobCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn công việc</option>
                      {jobCategories.map((job, index) => (
                        <option key={index} value={job}>{job}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hạng mục */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hạng mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="taskCategory"
                      value={newCostItem.taskCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!newCostItem.jobCategory}
                    >
                      <option value="">Chọn hạng mục</option>
                      {newCostItem.jobCategory &&
                        taskCategories[newCostItem.jobCategory].map((task, index) => (
                          <option key={index} value={task}>{task}</option>
                        ))}
                    </select>
                  </div>

                  {/* Người thực hiện */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Người thực hiện <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="executor"
                      value={newCostItem.executor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn người thực hiện</option>
                      {executors.map((executor, index) => (
                        <option key={index} value={executor}>{executor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Đơn vị */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Đơn vị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={newCostItem.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ví dụ: giờ, ngày công..."
                    />
                  </div>

                  {/* Khối lượng */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Khối lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={newCostItem.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  {/* Đơn giá */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Đơn giá <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="unitPrice"
                      value={newCostItem.unitPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  {/* Thành tiền */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Thành tiền <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalPrice"
                      value={newCostItem.totalPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  {/* Ghi chú */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                    <textarea
                      name="note"
                      value={newCostItem.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={handleCloseDialog}
                    className="px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <FiX className="mr-2" /> Hủy
                  </button>
                  <button
                    onClick={handleSaveCost}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FiSave className="mr-2" /> Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CostSection = ({ title, type, items, onAdd, onEdit, onDelete }) => {
    const totalAmount = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  
    return (
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} mục • Tổng chi phí: {totalAmount.toLocaleString()} VND
            </p>
          </div>
          <button
            onClick={() => onAdd(type)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-2" /> Thêm mục
          </button>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nội dung</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Công việc</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hạng mục</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Người thực hiện</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Đơn vị</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Khối lượng</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Đơn giá</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Thành tiền</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800">{item.content}</td>
                  <td className="px-4 py-3 text-gray-800">{item.jobCategory}</td>
                  <td className="px-4 py-3 text-gray-700">{item.taskCategory}</td>
                  <td className="px-4 py-3 text-gray-700">{item.executor}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{item.unit}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">
                    {Number(item.unitPrice).toLocaleString()} VND
                  </td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">
                    {Number(item.totalPrice).toLocaleString()} VND
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(index, type)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(index, type)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default CostManagement;