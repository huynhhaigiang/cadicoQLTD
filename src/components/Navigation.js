import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUser, FiChevronDown, FiMenu } from 'react-icons/fi';
import {
  RiShoppingCart2Line,
  RiNotification3Line,
  RiLoginCircleLine,
  RiUserAddLine,
  RiLockPasswordLine,
  RiMessage2Line,
  RiSettings4Line,
  RiDashboardLine,
} from 'react-icons/ri';
import { jwtDecode } from 'jwt-decode';

const Navigation = ({ onToggle }) => {
  const [userRole, setUserRole] = useState('guest');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.Role;
        setUserRole(role);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole('guest');
      }
    } else {
      setUserRole('guest');
    }
  }, []);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle?.(newCollapsedState);
    if (newCollapsedState) {
      setExpandedItems({});
    }
  };

  const toggleExpand = (text) => {
    if (!isCollapsed) {
      setExpandedItems((prev) => ({
        ...prev,
        [text]: !prev[text],
      }));
    }
  };

  const roleBasedNavItems = {
    teamlead: [
      { icon: <RiNotification3Line />, text: 'Thông báo', to: '/notificationpage' },
      {
        icon: <FiUser />,
        text: 'Dự án',
        to: '/projects',
      },

      { icon: <RiShoppingCart2Line />, text: 'Quản lí dự án', to: '/projectmanagement' },
      { icon: <RiShoppingCart2Line />, text: 'Quản lí tiến độ', to: '/projectmanagementstack' },
      { icon: <RiLoginCircleLine />, text: 'Quản lí công việc', to: '/quanlicongviec' },
      { icon: <RiUserAddLine />, text: 'Thông tin người dùng', to: '/userprofile' },
      { icon: <RiSettings4Line />, text: 'Cài đặt', to: '/settings' },
      { icon: <RiMessage2Line />, text: 'Đăng xuất', to: '/' },
    ],
    employee: [
      { icon: <RiDashboardLine />, text: 'Dashboard', to: '/dashboard' },
      { icon: <RiNotification3Line />, text: 'Thông báo', to: '/notificationpage' },
      { icon: <RiUserAddLine />, text: 'Thông tin người dùng', to: '/userprofile' },
      { icon: <RiMessage2Line />, text: 'Đăng xuất', to: '/' },
    ],
    guest: [{ icon: <RiMessage2Line />, text: 'Đăng xuất', to: '/' }],
  };

  const NavItem = ({ icon, text, to, children, isExpandable }) => {
    const isExpanded = expandedItems[text];

    if (to) {
      return (
        <li className="list-none">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : ''} py-3 px-4 transition-all duration-200 ${isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              } rounded-lg group relative`
            }
          >
            <div className="flex items-center justify-center w-7 h-7">
              <span className="text-xl">{icon}</span>
            </div>
            {!isCollapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
          </NavLink>

        </li>
      );
    }

    return (
      <li className="list-none">
        <button
          onClick={() => toggleExpand(text)}
          className={`w-full flex items-center justify-between py-3 px-4 transition-all duration-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg ${isExpanded ? 'bg-blue-50 text-blue-600' : ''
            } group relative`}
        >
          <div className="flex items-center">
            <span className="text-xl">{icon}</span>
            {!isCollapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
          </div>
          {!isCollapsed && isExpandable && (
            <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <FiChevronDown />
            </span>
          )}

        </button>
        {!isCollapsed && isExpanded && children}
      </li>
    );
  };

  const SubNavItem = ({ text, to }) => (
    <li className="list-none">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block py-2 pl-12 pr-4 text-sm transition-all duration-200 ${isActive
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          } rounded-lg`
        }
      >
        {text}
      </NavLink>
    </li>
  );

  return (
    <nav className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center">
              <img src="./img/logo.png" alt="" className="h-12 w-12" />
              <span className="text-xl font-bold text-black text-opacity-70 ml-2">Cadico QLTĐ</span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
          >
            <FiMenu className="text-gray-600 text-xl" />
          </button>
        </div>

        <div className="space-y-2">
          {roleBasedNavItems[userRole]?.map((item) => (
            <NavItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              to={item.to}
              isExpandable={item.isExpandable}
            >
              {item.subItems && (
                <ul className="mt-1 list-none">
                  {item.subItems.map((subItem) => (
                    <SubNavItem key={subItem.text} {...subItem} />
                  ))}
                </ul>
              )}
            </NavItem>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
