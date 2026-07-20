import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "./categoryData";

const CategorySection = () => {
  return (
    <section className="mt-10">

      {/* Header */}

      <div className="flex justify-between items-end">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Shop by Category
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Everything you need in one place
          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-1
            text-emerald-600
            font-semibold
            hover:text-emerald-700
            transition
          "
        >
          See All
          <ArrowRight size={18} />
        </button>

      </div>

      {/* Categories */}

      <div
        className="
          mt-6
          flex
          gap-5
          overflow-x-auto
          scrollbar-hide
          pb-3
        "
      >

        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.05,
                duration: 0.35,
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="min-w-[105px] cursor-pointer"
            >

              <div
                className={`
                  ${category.color}
                  h-24
                  rounded-[28px]
                  shadow-lg
                  flex
                  items-center
                  justify-center
                  border
                  border-white
                  transition-all
                `}
              >

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/70
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <Icon
                    size={30}
                    className="text-emerald-600"
                  />
                </div>

              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-center
                  text-slate-700
                "
              >
                {category.title}
              </p>

            </motion.div>
          );
        })}

      </div>

    </section>
  );
};

export default CategorySection;