import {
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Radio,
  RefreshCw,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import BottomNavbar from "../../components/DeliveryPartner/BottomNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import {
  acceptRiderOrder,
  fetchAvailableRiderOrders,
  updateRiderOrderStatus,
} from "../../api/orderApi";
import { useSocket } from "../../context/SocketContext";
import newRiderSound from "../../assets/riderNotification.wav";
import { createNotificationPlayer } from "../../utils/notificationSound";
import RiderOrderMap from "./RiderOrderMap";


const Dashboard = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phoneNumber: "",
    aadharNumber: "",
    drivingLicenseNumber: "",
    image: null,
  });
  const socket = useSocket();

  const [incoming, setIncoming] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [expiredOrderIds, setExpiredOrderIds] = useState(() => new Set());
  const [clock, setClock] = useState(0);

  const notificationPlayerRef = useRef(null);

  useEffect(() => {
    notificationPlayerRef.current = createNotificationPlayer(newRiderSound);
    const unlockAudio = () => {
      notificationPlayerRef.current?.unlock();
    };

    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      notificationPlayerRef.current?.destroy();
      notificationPlayerRef.current = null;
    };
  }, []);



  const fetchProfile = async () => {
    setProfileError(false);
    try {
      const response = await api.get("/rider/myprofile");
      setProfile(response.data.riderProfile || null);
    } catch (error) {
      setProfileError(error.response?.status !== 404);
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Unable to load rider profile",
        );
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (user?.role === "rider") fetchProfile();
      else setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value, files } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const createProfile = async (event) => {
    event.preventDefault();
    const {
      name,
      phoneNumber,
      aadharNumber,
      aadharImage,
      drivingLicenseNumber,
      image,
    } = profileForm;

    if (
      !name.trim() ||
      !phoneNumber ||
      !aadharNumber ||
      !aadharImage ||
      !drivingLicenseNumber ||
      !image
    ) {
      toast.error("Please complete all fields and select both images");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Location access is required to create your profile");
      return;
    }

    setCreatingProfile(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const formData = new FormData();
          formData.append("name", name.trim());
          formData.append("phoneNumber", phoneNumber);
          formData.append("aadharNumber", aadharNumber);
          formData.append("aadharImage", aadharImage);
          formData.append("drivingLicenseNumber", drivingLicenseNumber);
          formData.append("latitude", coords.latitude);
          formData.append("longitude", coords.longitude);
          formData.append("image", image);

          const response = await api.post("/rider/add/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setProfile(response.data.riderProfile);
          toast.success(
            response.data.message || "Rider profile created successfully",
          );
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Unable to create rider profile",
          );
        } finally {
          setCreatingProfile(false);
        }
      },
      () => {
        setCreatingProfile(false);
        toast.error("Please allow location access to create your profile");
      },
    );
  };

  const fetchCurrentOrder = async () => {
    try {
      const { data } = await api.get("/rider/order/current");
      setCurrentOrder(data.orders?.[0] || data.order || null);
    } catch (err) {
      console.error("Error fetching current order:", err);
      if (err.response?.status !== 404) {
        toast.error(err.response?.data?.message || "Unable to fetch current order");
      }
      setCurrentOrder(null);
    }
  };

  useEffect(() => {
    if (user?.role !== "rider") return undefined;
    const timer = window.setTimeout(fetchCurrentOrder, 0);
    return () => window.clearTimeout(timer);
  }, [user?.role]);

  const fetchAvailableOrders = async () => {
    try {
      const { orders = [] } = await fetchAvailableRiderOrders();
      setIncoming((current) => {
        const currentById = new Map(current.map((order) => [order.orderId, order]));
        const available = orders.map((order) => ({
          ...(currentById.get(order._id) || {}),
          ...order,
          orderId: order._id,
          formattedAddress: order.deliveryAddress?.formattedAddress,
          receivedAt: currentById.get(order._id)?.receivedAt || Date.now(),
        }));
        const combined = [...available, ...current];
        return combined.filter(
          (order, index, items) =>
            !expiredOrderIds.has(order.orderId) &&
            items.findIndex((item) => item.orderId === order.orderId) === index,
        );
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching available rider orders:", error);
      }
    }
  };

  useEffect(() => {
    if (user?.role !== "rider" || !profile?.isAvailable) return undefined;

    const initialFetch = window.setTimeout(fetchAvailableOrders, 0);
    const interval = window.setInterval(fetchAvailableOrders, 10000);
    return () => {
      window.clearTimeout(initialFetch);
      window.clearInterval(interval);
    };
  }, [user?.role, profile?.isAvailable, expiredOrderIds]);

  useEffect(() => {
    const timers = incoming.map((order) =>
      window.setTimeout(() => {
        setIncoming((items) => items.filter((item) => item.orderId !== order.orderId));
        setExpiredOrderIds((ids) => new Set(ids).add(order.orderId));
      }, Math.max(0, 60000 - (Date.now() - (order.receivedAt || Date.now())))),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [incoming]);

  useEffect(() => {
    const startClock = window.setTimeout(() => setClock(Date.now()), 0);
    const interval = window.setInterval(() => setClock(Date.now()), 1000);

    return () => {
      window.clearTimeout(startClock);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!socket || user?.role !== "rider") return undefined;

    const handleOrderReady = (order) => {
      if (!order?.orderId) return;
      setIncoming((items) =>
        items.some((item) => item.orderId === order.orderId)
          ? items
          : [{ ...order, receivedAt: Date.now() }, ...items],
      );
      notificationPlayerRef.current?.play();
    };

    socket.on("order:ready_for_rider", handleOrderReady);
    return () => socket.off("order:ready_for_rider", handleOrderReady);
  }, [socket, user?.role]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setAcceptingOrderId(orderId);
      const response = await acceptRiderOrder(orderId);
      setCurrentOrder(response.order || null);
      setIncoming((items) => items.filter((item) => item.orderId !== orderId));
      setExpiredOrderIds((ids) => {
        const next = new Set(ids);
        next.delete(orderId);
        return next;
      });
      await fetchProfile();
      toast.success(response.message || "Order accepted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to accept order");
    } finally {
      setAcceptingOrderId(null);
    }
  };

  const toggleAvailability = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access is required");
      return;
    }

    setToggling(true);
    const nextAvailability = !profile.isAvailable;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.patch("/rider/toggle-availability", {
            isAvailable: nextAvailability,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          await fetchProfile();

          toast.success(
            nextAvailability ? "You are now online" : "You are now offline",
          );
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Unable to update availability",
          );
        } finally {
          setToggling(false);
        }
      },
      () => {
        setToggling(false);
        toast.error("Please allow location access to update availability");
      },
    );
  };

  const handleAdvanceOrder = async () => {
    if (!currentOrder?._id) return;

    try {
      setUpdatingOrder(true);
      const response = await updateRiderOrderStatus(currentOrder._id);
      setCurrentOrder(response.order || null);
      toast.success(
        response.order?.status === "delivered"
          ? "Delivery completed"
          : "Order marked as picked up",
      );
      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update delivery");
    } finally {
      setUpdatingOrder(false);
    }
  };

  if (user?.role !== "rider") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You are not registered as rider.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3faf7] px-4 py-6 pb-32">
        <DashboardSkeleton />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3faf7] px-6 pb-24 text-center">
        <div className="max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <RefreshCw size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Unable to load dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading your delivery information.
          </p>
          <button onClick={fetchProfile} className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-emerald-50 px-6 py-10 pb-24">
        <form
          onSubmit={createProfile}
          className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg"
        >
          <h1 className="mb-2 text-3xl font-bold">Create rider profile</h1>
          <p className="mb-6 text-slate-600">
            Complete your details before accepting deliveries.
          </p>
          <div className="space-y-4">
            <input
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Full name"
              type="text"
              required
              className="w-full rounded-lg border p-3"
            />
            <input
              name="phoneNumber"
              value={profileForm.phoneNumber}
              onChange={handleProfileChange}
              placeholder="Phone number"
              type="tel"
              required
              className="w-full rounded-lg border p-3"
            />
            <input
              name="aadharNumber"
              value={profileForm.aadharNumber}
              onChange={handleProfileChange}
              placeholder="Aadhaar number"
              required
              className="w-full rounded-lg border p-3"
            />

            <input
              name="drivingLicenseNumber"
              value={profileForm.drivingLicenseNumber}
              onChange={handleProfileChange}
              placeholder="Driving license number"
              required
              className="w-full rounded-lg border p-3"
            />
            <label className="block text-sm font-medium text-slate-700">
              Aadhaar image
              <input
                name="aadharImage"
                onChange={handleProfileChange}
                type="file"
                accept="image/*"
                required
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Profile image
              <input
                name="image"
                onChange={handleProfileChange}
                type="file"
                accept="image/*"
                required
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
            <button
              disabled={creatingProfile}
              className="w-full rounded-lg bg-emerald-600 p-3 font-semibold text-white disabled:opacity-60"
            >
              {creatingProfile ? "Creating profile..." : "Create rider profile"}
            </button>
          </div>
        </form>
        <BottomNavbar />
      </div>
    );
  }

  const riderName = profile.name || user.name || "Rider";
  const earnings = currentOrder?.riderAmount;

  return (
    <div className="min-h-screen bg-[#f3faf7] pb-32 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Good evening, {riderName}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Delivery Dashboard</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 font-bold text-emerald-700">
            {profile.picture ? <img src={profile.picture} alt="" className="h-full w-full object-cover" /> : riderName.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className={`rounded-3xl p-5 shadow-sm ring-1 ${profile.isAvailable ? "bg-emerald-600 text-white ring-emerald-500" : "bg-white text-slate-900 ring-slate-100"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${profile.isAvailable ? "bg-white" : "bg-slate-300"}`} />
              <div>
                <h2 className="text-lg font-bold">You're {profile.isAvailable ? "Online" : "Offline"}</h2>
                <p className={`mt-1 text-sm ${profile.isAvailable ? "text-emerald-50" : "text-slate-500"}`}>
                  {profile.isAvailable ? "Receiving delivery requests" : "Go online to receive deliveries"}
                </p>
              </div>
            </div>
            <button onClick={toggleAvailability} disabled={toggling} className={`rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-60 ${profile.isAvailable ? "bg-white text-emerald-700 hover:bg-emerald-50" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
              {toggling ? "Updating..." : profile.isAvailable ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Your next move</p><h2 className="mt-1 text-xl font-bold">{currentOrder ? "Active Delivery" : "Incoming Deliveries"}</h2></div>
              {incoming.length > 0 && !currentOrder && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{incoming.length} new</span>}
            </div>
            {currentOrder ? <ActiveDelivery order={currentOrder} onAdvance={handleAdvanceOrder} updating={updatingOrder} /> : profile.isAvailable && incoming.length > 0 ? incoming.map((order) => <IncomingDelivery key={order.orderId} order={order} clock={clock} accepting={acceptingOrderId === order.orderId} onAccept={() => handleAcceptOrder(order.orderId)} />) : <EmptyDeliveryState isOnline={profile.isAvailable} onGoOnline={toggleAvailability} />}
          </section>

          <aside className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-bold">Today's Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <OverviewCard label="Incoming" value={incoming.length} icon={<Package size={18} />} />
                <OverviewCard label="Active" value={currentOrder ? 1 : 0} icon={<Truck size={18} />} />
                {earnings !== undefined && <OverviewCard label="Earnings" value={`₹${Number(earnings).toLocaleString("en-IN")}`} icon={<CheckCircle2 size={18} />} />}
              </div>
            </section>
            {currentOrder?.riderAmount !== undefined && <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><p className="text-sm font-medium text-slate-500">Today's Earnings</p><p className="mt-1 text-3xl font-bold">₹{Number(currentOrder.riderAmount).toLocaleString("en-IN")}</p><p className="mt-2 text-sm text-slate-500">For this active delivery</p></section>}
          </aside>
        </div>
      </main>

      <RiderOrderMap currentOrder={currentOrder} />
      <BottomNavbar />
    </div>
  );
};

const shortId = (id) => id ? `#${String(id).slice(-8)}` : "#—";
const addressParts = (order) => (order.deliveryAddress?.formattedAddress || order.formattedAddress || "Address available after acceptance").split(",").map((part) => part).filter(Boolean);
const MapsLink = ({ order, label = "Navigate" }) => {
  const address = order.deliveryAddress;
  const destination = address?.latitude !== undefined && address?.longitude !== undefined
    ? `${address.latitude},${address.longitude}`
    : address?.formattedAddress;
  if (!destination) return null;
  return <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"><Navigation size={16} />{label}</a>;
};
const AddressBlock = ({ order, title = "Drop location" }) => <div className="mt-5 flex gap-3"><MapPin className="mt-0.5 shrink-0 text-emerald-600" size={19} /><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p><p className="mt-1 font-bold text-slate-900">{order.deliveryAddress?.fullName || "Customer"}</p><p className="mt-1 max-w-lg text-sm leading-5 text-slate-500">{addressParts(order).slice(0, 3).map((part, index) => <span key={`${part}-${index}`} className="block">{part}{index === 2 ? "" : index < addressParts(order).length - 1 ? "," : ""}</span>)}</p></div></div>;
const IncomingDelivery = ({ order, clock, accepting, onAccept }) => {
  const remainingSeconds = clock
    ? Math.max(0, Math.ceil((60000 - (clock - order.receivedAt)) / 1000))
    : 60;
  const expired = remainingSeconds === 0;
  const timerLabel = expired
    ? "Expired"
    : `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  return <article className="mb-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700"><Radio size={13} /> New delivery</span><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${expired ? "bg-slate-100 text-slate-500" : remainingSeconds <= 10 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{expired ? "Expired" : `Accept in ${timerLabel}`}</span></div><AddressBlock order={order} /><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-xs text-slate-400">Order {shortId(order.orderId || order._id)}</p>{order.riderDistance !== undefined && <p className="mt-1 text-sm font-semibold text-slate-600">{order.riderDistance} away</p>}</div><MapsLink order={order} /></div><div className="mt-5 flex gap-3"><button type="button" onClick={onAccept} disabled={accepting || expired} className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">{accepting ? "Accepting..." : expired ? "Request expired" : "Accept Delivery"}</button></div></article>;
};
const stages = [{ status: "rider_assigned", label: "Accepted" }, { status: "picked_up", label: "Picked up" }, { status: "delivered", label: "Delivered" }];
const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const PhoneLink = ({ phone, label }) => phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"><Phone size={14} />{label}</a> : <span className="text-xs text-slate-400">Not available</span>;
const ActiveDelivery = ({ order, onAdvance, updating }) => {
  const currentIndex = stages.findIndex((stage) => stage.status === order.status);
  const nextLabel = order.status === "rider_assigned" ? "Mark as Picked Up" : order.status === "picked_up" ? "Complete Delivery" : null;
  const dropAddress = addressParts(order).join(", ");
  const customerPhone = order.deliveryAddress?.mobile || order.mobile || order.customerPhone;
  const shopPhone = order.shopPhone || order.shop?.phone;
  return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
    <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Delivery in progress</div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700">{order.status?.replaceAll("_", " ")}</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><SummaryStat label="Total price" value={formatMoney(order.totalAmount)} /><SummaryStat label="Your earning" value={formatMoney(order.riderAmount)} accent /><SummaryStat label="Distance" value={`${order.riderDistance ?? "—"} km`} /><SummaryStat label="Order" value={shortId(order._id || order.orderId)} /></div>
    <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch"><LocationCard icon={<Store size={17} />} label="Pickup from shop" name={order.shopName || "Shop"} address={order.pickupAddress || "Pickup location available in navigation"} phone={shopPhone} phoneLabel="Call shopkeeper" /><div className="hidden items-center justify-center text-emerald-500 md:flex"><ArrowRight size={20} /></div><LocationCard icon={<MapPin size={17} />} label="Drop to customer" name={order.deliveryAddress?.fullName || "Customer"} address={dropAddress || "Address unavailable"} phone={customerPhone} phoneLabel="Call customer" /></div>
    <div className="mt-5 flex items-center justify-between gap-2">{stages.map((stage, index) => <div key={stage.status} className="flex items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index <= currentIndex ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>{index < currentIndex ? <Check size={14} /> : index + 1}</div>{index < stages.length - 1 && <div className={`h-px w-5 sm:w-10 ${index < currentIndex ? "bg-emerald-500" : "bg-slate-200"}`} />}</div>)}</div>
    <div className="mt-4 flex items-center justify-end text-xs text-slate-500"><MapsLink order={order} label="Navigate to drop" /></div>
    {nextLabel && <button onClick={onAdvance} disabled={updating} className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60">{updating ? "Updating..." : nextLabel}</button>}
  </article>;
};
const SummaryStat = ({ label, value, accent }) => <div className={`rounded-2xl p-3 ${accent ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-900"}`}><p className={`text-[10px] font-bold uppercase tracking-wider ${accent ? "text-emerald-100" : "text-slate-400"}`}>{label}</p><p className="mt-1 truncate text-lg font-black">{value}</p></div>;
const LocationCard = ({ icon, label, name, address, phone, phoneLabel }) => <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">{icon}{label}</div><p className="mt-2 font-bold text-slate-900">{name}</p><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{address}</p><div className="mt-3"><PhoneLink phone={phone} label={phoneLabel} /></div></div>;
const OverviewCard = ({ label, value, icon }) => <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</div><p className="mt-3 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
const EmptyDeliveryState = ({ isOnline, onGoOnline }) => <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Truck size={24} /></div><h3 className="mt-4 font-bold">{isOnline ? "No delivery requests" : "You're currently offline"}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{isOnline ? "You're online and ready. New requests will appear here." : "Go online to start receiving delivery requests."}</p>{!isOnline && <button onClick={onGoOnline} className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Go Online</button>}</div>;

const DashboardSkeleton = () => <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-12 w-2/3 rounded-xl bg-slate-200" /><div className="h-28 rounded-3xl bg-slate-200" /><div className="h-7 w-1/3 rounded-lg bg-slate-200" /><div className="h-64 rounded-3xl bg-slate-200" /></div>;


export default Dashboard;
