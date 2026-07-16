import { categories } from "./categoryData";

const CategorySection = () => {
  return (
    <div className="mt-8">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold">
          Categories
        </h2>

        <button className="text-emerald-600 font-semibold">
          View All
        </button>

      </div>

      <div className="mt-5 flex gap-5 overflow-x-auto scrollbar-hide pb-2">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.id}
              className="flex flex-col items-center min-w-[90px] cursor-pointer"
            >

              <div
                className={`${category.color} w-20 h-20 rounded-3xl flex items-center justify-center shadow hover:scale-110 hover:-translate-y-2duration-300 transition`}
              >
                <Icon
                  size={32}
                  className="text-emerald-600"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-center">
                {category.title}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default CategorySection;