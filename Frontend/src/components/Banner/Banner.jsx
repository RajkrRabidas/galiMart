import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const banners = [
  { title: "Everyday essentials", subtitle: "At your door in minutes", offer: "FLAT 40% OFF", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900", color: "from-emerald-100 to-green-200" },
  { title: "Snack time sorted", subtitle: "Your favourites, delivered fast", offer: "SAVE ₹200", image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=900", color: "from-[#fff3d9] to-[#ffe2a3]" },
  { title: "Fresh picks today", subtitle: "Farm fresh, handpicked for you", offer: "30% OFF", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900", color: "from-[#ecf8e8] to-[#c9edbe]" },
];

const Banner = () => (
  <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500 }} pagination={{ clickable: true }} loop className="mt-6 rounded-3xl">
    {banners.map((banner) => <SwiperSlide key={banner.title}><div className={`relative h-[210px] overflow-hidden rounded-3xl bg-gradient-to-r ${banner.color} shadow-md`}>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/30" />
      <div className="relative z-10 flex h-full items-center justify-between px-6 sm:px-8"><div className="max-w-[58%]"><span className="inline-block rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-white">{banner.offer}</span><h2 className="mt-3 text-3xl font-black leading-tight text-slate-900">{banner.title}</h2><p className="mt-2 text-sm text-slate-600">{banner.subtitle}</p><button className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-800">Shop now <ArrowRight size={16}/></button></div><img src={banner.image} alt="" className="h-44 w-[38%] rounded-2xl object-cover shadow-xl transition-transform duration-500 hover:scale-105" /></div>
    </div></SwiperSlide>)}
  </Swiper>
);

export default Banner;
