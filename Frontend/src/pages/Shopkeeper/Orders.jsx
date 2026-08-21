import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Phone,
  UserRound,
} from "lucide-react";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { useShops } from "../../context/ShopContext";
import { useSocket } from "../../context/SocketContext";
import { fetchShopOrders, updateOrderStatus } from "../../api/orderApi";
import newOrderSound from "../../assets/notification.wav";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "placed", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "preparing", label: "Preparing" },
  { id: "ready_for_rider", label: "Ready" },
  { id: "delivered", label: "Completed" },
];

const STATUS_META = {
  placed: { label: "New Order", dot: "bg-emerald-500", text: "text-emerald-700" },
  accepted: { label: "Accepted", dot: "bg-blue-500", text: "text-blue-700" },
  preparing: { label: "Preparing", dot: "bg-amber-500", text: "text-amber-700" },
  ready_for_rider: { label: "Ready for Rider", dot: "bg-violet-500", text: "text-violet-700" },
  rider_assigned: { label: "Rider Assigned", dot: "bg-sky-500", text: "text-sky-700" },
  picked_up: { label: "Picked Up", dot: "bg-cyan-500", text: "text-cyan-700" },
  delivered: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-700" },
  cancelled: { label: "Cancelled", dot: "bg-rose-500", text: "text-rose-700" },
};

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDateTime = (timestamp) => {
  if (!timestamp) return "Recent order";

  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today • ${time}`;
  }

  const dayMonth = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${dayMonth} • ${time}`;
};

const getNextStatus = (status) => ({
  placed: "accepted",
  accepted: "preparing",
  preparing: "ready_for_rider",
})[status] || null;

const getActionLabel = (status) => ({
  placed: "Accept Order",
  accepted: "Start Preparing",
  preparing: "Mark as Ready",
})[status] || "View Order";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [shop, setShop] = useState(null);
  const socket = useSocket();
  const { getMyShop } = useShops();
  const newOrderAudioRef = useRef(null);

  const playNewOrderSound = () => {
    if (!newOrderAudioRef.current) {
      newOrderAudioRef.current = new Audio(newOrderSound);
    }

    const audio = newOrderAudioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Browser may block autoplay until user interaction; ignore silent failure.
    });
  };

  const fetchOrders = async (shopId) => {
    if (!shopId) {
      setOrders([]);
      setLoading(false);
      setError(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const response = await fetchShopOrders(shopId);
      setOrders(Array.isArray(response?.orders) ? response.orders : []);
    } catch (errorInfo) {
      console.error("Failed to fetch shop orders:", errorInfo);
      setOrders([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadShopAndOrders = async () => {
      try {
        const shopData = await getMyShop();
        if (!mounted) return;
        setShop(shopData);
        await fetchOrders(shopData?._id);
      } catch (errorInfo) {
        console.error("Failed to load shop orders:", errorInfo);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadShopAndOrders();
    return () => {
      mounted = false;
    };
  }, [getMyShop]);

  useEffect(() => {
    if (!socket || !shop?._id) return undefined;

    const refreshOrders = () => fetchOrders(shop._id);
    const handleNewOrder = () => {
      refreshOrders();
      playNewOrderSound();
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:rider_assigned", refreshOrders);
    socket.on("order:updated", refreshOrders);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:rider_assigned", refreshOrders);
      socket.off("order:updated", refreshOrders);
    };
  }, [socket, shop?._id]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
    const acceptedOrders = orders.filter((order) => order.status === "accepted").length;
    const completedOrders = orders.filter((order) => order.status === "delivered").length;

    return { totalOrders, pendingOrders, acceptedOrders, completedOrders };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await fetchOrders(shop?._id);
      toast.success("Order updated");
    } catch (errorInfo) {
      toast.error(errorInfo.response?.data?.message || "Unable to update order");
    }
  };

  const handleRetry = async () => {
    if (!shop?._id) return;
    await fetchOrders(shop._id);
  };

  return (
    <div className="min-h-screen bg-[#eefaf5] pb-28">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-5">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.05em] text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track your customer orders</p>
        </div>

        {!loading && !error && orders.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Orders</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{summary.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Pending</p>
              <p className="mt-2 text-xl font-bold text-amber-700">{summary.pendingOrders}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Accepted</p>
              <p className="mt-2 text-xl font-bold text-blue-700">{summary.acceptedOrders}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Completed</p>
              <p className="mt-2 text-xl font-bold text-emerald-700">{summary.completedOrders}</p>
            </div>
          </div>
        )}

        <div className="mb-5 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {FILTERS.map((item) => {
              const isActive = filter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-5 w-28 rounded bg-slate-200" />
                  <div className="h-6 w-20 rounded bg-slate-200" />
                </div>
                <div className="mt-4 h-4 w-32 rounded bg-slate-200" />
                <div className="mt-4 h-12 rounded bg-slate-100" />
                <div className="mt-4 h-10 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-rose-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle size={22} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Unable to load orders</h2>
            <p className="mt-2 text-sm text-slate-500">Something went wrong while fetching your orders.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Clock3 size={26} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {orders.length === 0 ? "No orders yet" : "No orders found"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {orders.length === 0
                ? "Your customer orders will appear here."
                : "Try another status filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const actionLabel = nextStatus ? getActionLabel(order.status) : "View Order";
              const statusMeta = STATUS_META[order.status] || {
                label: order.status || "Order",
                dot: "bg-slate-500",
                text: "text-slate-700",
              };
              const customerName = order.customerName || order.userName || "Customer";
              const customerPhone = order.deliveryAddress?.mobile || order.mobile;
              const readableItems = Array.isArray(order.items) ? order.items : [];
              const visibleItems = readableItems.slice(0, 3);
              const remainingItems = readableItems.length - visibleItems.length;
              const isExpanded = expandedOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className={`rounded-[28px] border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    order.status === "placed" ? "border-emerald-100 ring-1 ring-emerald-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold tracking-tight text-slate-900">#{order._id?.slice(-6).toUpperCase() || "ORDER"}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <Clock3 size={12} />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black tracking-tight text-emerald-700">{formatMoney(order.totalAmount)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                      <UserRound size={14} className="shrink-0 text-slate-500" />
                      <span className="truncate">{customerName}</span>
                    </div>

                    {customerPhone && (
                      <a
                        href={`tel:${customerPhone}`}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:border-slate-300"
                      >
                        <Phone size={12} />
                        Call
                      </a>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                    {visibleItems.map((item) => (
                      <div key={`${order._id}-${item.itemId || item.name || item._id}`} className="flex items-center justify-between gap-4 text-sm text-slate-700">
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{item.quantity || 1} ×</span>
                          <span className="truncate">{item.name || "Item"}</span>
                        </span>
                        <span className="font-medium text-slate-800">{formatMoney(item.total ?? item.price * (item.quantity || 1))}</span>
                      </div>
                    ))}

                    {remainingItems > 0 && (
                      <div className="text-xs font-medium text-slate-500">+ {remainingItems} more item{remainingItems > 1 ? "s" : ""}</div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusMeta.dot}`} />
                      <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${statusMeta.text}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (nextStatus) {
                          handleStatusUpdate(order._id, nextStatus);
                          return;
                        }
                        setExpandedOrderId((current) => (current === order._id ? null : order._id));
                      }}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                        nextStatus
                          ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {nextStatus ? actionLabel : "View Order"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Order details</h3>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setExpandedOrderId(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"
                        >
                          Hide details
                          <ChevronUp size={14} />
                        </button>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">Order ID</p>
                          <p className="mt-1 font-medium text-slate-900">#{(order._id || "").slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">Order total</p>
                          <p className="mt-1 font-medium text-emerald-700">{formatMoney(order.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">Customer</p>
                          <p className="mt-1 font-medium text-slate-900">{customerName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">Payment</p>
                          <p className="mt-1 font-medium text-slate-900">{order.paymentStatus || "Paid"}</p>
                        </div>
                        {order.deliveryAddress?.formattedAddress && (
                          <div className="sm:col-span-2">
                            <p className="text-[11px] uppercase tracking-wide text-slate-500">Delivery address</p>
                            <p className="mt-1 font-medium text-slate-800">{order.deliveryAddress.formattedAddress}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Items</div>
                        <div className="space-y-2">
                          {readableItems.map((item) => (
                            <div key={`${order._id}-detail-${item.itemId || item.name}`} className="flex items-center justify-between gap-4 text-sm">
                              <span className="text-slate-700">
                                {item.quantity || 1} × {item.name || "Item"}
                              </span>
                              <span className="font-medium text-slate-900">{formatMoney(item.total ?? item.price * (item.quantity || 1))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setExpandedOrderId((current) => (current === order._id ? null : order._id));
                      }}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                    >
                      View details
                      <ChevronDown size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Orders;
