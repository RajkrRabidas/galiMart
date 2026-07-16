import { ChevronRight } from "lucide-react";

const MenuItem = ({ icon, title, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-5 hover:bg-gray-50 transition rounded-2xl cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="bg-emerald-100 p-3 rounded-xl">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      <ChevronRight />
    </div>
  );
};

export default MenuItem;