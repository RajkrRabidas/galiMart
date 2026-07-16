const StatsCard = ({
  title,
  value,
  icon,
  color,
}) => {

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div
          className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center`}
        >

          {icon}

        </div>

      </div>

    </div>

  );

};

export default StatsCard;