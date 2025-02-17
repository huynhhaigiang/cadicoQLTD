import React, { useEffect, useState } from "react";
import connectNotificationHub from "../services/notificationService";
import { RiNotificationLine, RiErrorWarningLine, RiCheckLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NotificationComponent = () => {
  const [token] = useState(localStorage.getItem("token"));
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const connection = connectNotificationHub(token, (message) => {
        setNotifications((prev) => [{ id: Date.now(), message }, ...prev]);
        setIsLoading(false);
      });

      return () => {
        connection.stop();
      };
    } catch (err) {
      setError("Không thể kết nối đến hệ thống thông báo");
      setIsLoading(false);
    }
  }, [token]);

  const parseNotification = (message) => {
    try {
      return JSON.parse(message);
    } catch {
      return {
        title: "Thông báo hệ thống",
        content: message,
        timestamp: new Date().toISOString(),
        status: "unread"
      };
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(noti =>
        noti.id === notificationId ? { ...noti, status: "read" } : noti
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <RiNotificationLine className="text-2xl text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Thông Báo</h2>
        </div>
        <span className="text-sm text-gray-500">
          {notifications.length} thông báo
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <RiErrorWarningLine className="mr-2 text-xl" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton height={80} count={3} className="rounded-lg" />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const { title, content, timestamp, status } = parseNotification(
                notification.message
              );

              return (
                <div
                  key={notification.id}
                  className={`group p-4 rounded-lg shadow-sm hover:shadow-md transition-all border ${status === "unread"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-100"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Phần icon và nội dung */}
                    <div className="flex items-center flex-1">
                      <RiNotificationLine className={`text-xl mr-3 ${status === "unread" ? "text-blue-500" : "text-gray-400"
                        }`} />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800">{title}</h3>
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <RiCheckLine className="text-gray-500 hover:text-green-500" />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{content}</p>
                        <time className="text-xs text-gray-400">
                          {new Date(timestamp).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <RiNotificationLine className="text-3xl mx-auto mb-2 text-gray-400" />
              Không có thông báo mới
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;