import {
  Bell,
  CheckCheck,
  Trash2,
} from "lucide-react";

import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {

  const {
    notifications,
    markAsRead,
    markAllRead,
    clearNotifications,
  } = useNotifications();

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-5xl mx-auto p-6 pb-24">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

            Notifications

          </h1>

          <div className="flex gap-3">

            <button
              onClick={markAllRead}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <CheckCheck size={18}/>
              Read All
            </button>

            <button
              onClick={clearNotifications}
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              <Trash2 size={18}/>
            </button>

          </div>

        </div>

        {notifications.length === 0 ? (

          <div className="text-center mt-32">

            <Bell
              size={70}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-5">

              No Notifications

            </h2>

          </div>

        ) : (

          <div className="space-y-5">

            {notifications.map((item) => (

              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`cursor-pointer rounded-3xl p-6 shadow-lg transition
                ${
                  item.read
                    ? "bg-white"
                    : "bg-emerald-50 border border-emerald-300"
                }`}
              >

                <div className="flex justify-between">

                  <h2 className="font-bold text-lg">

                    {item.title}

                  </h2>

                  {!item.read && (

                    <span className="w-3 h-3 bg-emerald-600 rounded-full"/>

                  )}

                </div>

                <p className="text-gray-600 mt-2">

                  {item.message}

                </p>

                <p className="text-sm text-gray-400 mt-3">

                  {item.time}

                </p>

              </div>

            ))}

          </div>

        )}

      </div>

      <BottomNavbar/>

    </div>

  );

};

export default Notifications;