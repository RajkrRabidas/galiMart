import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import {
  ArrowRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Fresh Groceries",
    subtitle: "Delivered in 15 Minutes",
    offer: "UP TO 40% OFF",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
    color: "from-emerald-100 to-green-50",
  },
  {
    title: "Daily Essentials",
    subtitle: "Best Prices Everyday",
    offer: "SAVE ₹200",
    image:
      "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=900",
    color: "from-orange-100 to-yellow-50",
  },
  {
    title: "Fresh Fruits",
    subtitle: "Farm Fresh Everyday",
    offer: "30% OFF",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900",
    color: "from-lime-100 to-green-50",
  },
];

const Banner = () => {
  return (
    <Swiper
      modules={[
        Autoplay,
        Pagination,
      ]}
      autoplay={{
        delay: 3500,
      }}
      pagination={{
        clickable: true,
      }}
      loop
      className="mt-7 rounded-[30px]"
    >
      {banners.map(
        (banner, index) => (
          <SwiperSlide key={index}>
            <div
              className={`
              h-[240px]
              rounded-[30px]
              overflow-hidden
              bg-gradient-to-r
              ${banner.color}
              shadow-2xl
              relative
            `}
            >
              {/* Decorative blobs */}

              <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/30" />

              <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/20" />

              <div className="flex justify-between items-center h-full px-8 relative z-10">

                {/* Left */}

                <div className="max-w-sm">

                  <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-4">

                    {banner.offer}

                  </span>

                  <h2 className="text-4xl font-black text-slate-900 leading-tight">

                    {banner.title}

                  </h2>

                  <p className="mt-3 text-slate-600 text-lg">

                    {banner.subtitle}

                  </p>

                  <button
                    className="
                    mt-6
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-semibold
                    flex
                    items-center
                    gap-2
                    transition
                    hover:scale-105
                  "
                  >
                    Shop Now

                    <ArrowRight size={18} />

                  </button>

                </div>

                {/* Right */}

                <img
                  src={banner.image}
                  alt=""
                  className="
                  h-52
                  object-contain
                  drop-shadow-2xl
                "
                />

              </div>

            </div>
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
};

export default Banner;