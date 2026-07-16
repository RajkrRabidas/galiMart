import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Fresh Groceries",
    subtitle: "Up to 40% OFF",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
  },
  {
    title: "Fresh Fruits",
    subtitle: "Delivered in 10 Minutes",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900",
  },
  {
    title: "Daily Essentials",
    subtitle: "Best Prices Everyday",
    image:
      "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=900",
  },
];

const Banner = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      loop
      className="mt-6 rounded-3xl overflow-hidden shadow-xl"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div
            className="h-56 bg-cover bg-center flex items-center"
            style={{
              backgroundImage: `url(${banner.image})`,
            }}
          >
            <div className="bg-black/45 w-full h-full flex items-center">
              <div className="pl-10 text-white">

                <h2 className="text-4xl font-bold">
                  {banner.title}
                </h2>

                <p className="mt-2 text-xl">
                  {banner.subtitle}
                </p>

                <button className="mt-6 bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl font-semibold">
                  Shop Now
                </button>

              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;