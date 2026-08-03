import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Everyday essentials",
    subtitle: "At your door in minutes",
    offer: "FLAT 40% OFF",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
    color: "from-emerald-500 via-emerald-400 to-lime-200",
  },
  {
    title: "Fresh picks today",
    subtitle: "Farm fresh, handpicked for you",
    offer: "30% OFF",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900",
    color: "from-[#cdedd8] via-[#8dd2ac] to-[#50a86f]",
  },
];

const Banner = () => (
  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 3500 }}
    pagination={{ clickable: true }}
    loop
    className="mt-6 overflow-hidden rounded-4xl"
  >
    {banners.map((banner) => (
      <SwiperSlide key={banner.title}>
        <div className={`relative flex min-h-[180px] overflow-hidden rounded-4xl bg-linear-to-r ${banner.color} shadow-[0_20px_60px_rgba(15,23,42,0.12)]`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_32%)]" />
          <div className="relative z-10 flex flex-1 flex-col justify-between gap-3 p-4 sm:p-6">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 shadow-sm">
              {banner.offer}
            </span>
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">{banner.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/90 sm:text-base">
                {banner.subtitle}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-100">
              Shop now
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="hidden w-1/2 items-center justify-end sm:flex">
            <img
              src={banner.image}
              alt={banner.title}
              className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default Banner;
