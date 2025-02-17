// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Login from './components/Login';
import LoadingPage from './components/LoadingPage';
import Layout from './components/Layout';
import Projects from './pages_teamLead/DuAn';

// Import các component chức năng
import ProductsList from './pages_teamLead/CongTrinh';
import ProductsDetails from './pages_teamLead/ChuDauTu';
import Unit from './pages_teamLead/DonVi';
import TypeOfWork from './pages_teamLead/LoaiCV';
import WorkItems from './pages_teamLead/HangMucCV';
import Supplies from './pages_teamLead/Loaivattu';
import ProjectForm from './pages_teamLead/PhuongAnThiCong';
import MaterialRequestForm from './pages_teamLead/Dexuatvattu';
import ProjectManagement from './pages_teamLead/QuanLiDuAn';
import ProjectDetails from './pages_teamLead/Chitietduan';
import ProjectStatus from './pages_teamLead/QuanLiTienDo';
import TaskAssignmentPage from './pages_teamLead/PhanCongViec';
import ProgressReportPage from './pages_teamLead/BaoCaoTienDo';
import Dashboard from './pages_teamLead/TongQuat';
import NotificationComponent from './pages_teamLead/ThongBao';
import UserProfile from './pages_teamLead/ThongTinCaNhan';
import CostManagement from './pages_teamLead/ChiPhiThucHien';
import ProjectDetailPage from './pages_teamLead/DeXuat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/loadingPage" element={<LoadingPage />} />

        <Route element={<BaseLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notificationpage" element={<NotificationComponent />} />
          <Route path="/userprofile" element={<UserProfile />} />

          {/* Projects và các chức năng con */}
          <Route path="/projects" element={<Projects />}>
            <Route index element={<DefaultProjectView />} />
            <Route path="list" element={<ProductsList />} />
            <Route path="details" element={<ProductsDetails />} />
            <Route path="unit" element={<Unit />} />
            <Route path="typeofwork" element={<TypeOfWork />} />
            <Route path="workitems" element={<WorkItems />} />
            <Route path="supplies" element={<Supplies />} />
            <Route path="upload" element={<ProjectForm />} />
          </Route>

          {/* Chức năng quản lý dự án */}
          <Route path="/projectmanagement">
            <Route index element={<ProjectManagement />} />
            <Route path=":phuongAnThiCongId" element={<ProjectDetailPage />}>
              <Route index element={<CostManagement />} />
              <Route path="cost" element={<CostManagement />} />
              <Route path="material" element={<MaterialRequestForm />} />
            </Route>
          </Route>
          <Route path="/projectapproval/:projectId" element={<ProjectDetails />} />
          <Route path="/projectmanagementstack" element={<ProjectStatus />} />
          <Route path="/task-assignment/:projectId/:projectName" element={<TaskAssignmentPage />} />
          <Route path="/progressreportpage/:projectId" element={<ProgressReportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

const BaseLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const DefaultProjectView = () => (
  <div className="p-6 text-center text-gray-500">
    <h3 className="text-xl font-medium">Vui lòng chọn chức năng quản lý dự án</h3>
    <p className="mt-2">Sử dụng các tab phía trên để lựa chọn tính năng</p>
  </div>
);

export default App;