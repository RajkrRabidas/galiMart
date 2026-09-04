import { Check, Eye, Phone, RefreshCw, ShieldCheck, Store, Truck, X, Users, Package, IndianRupee, MessageSquare, ClipboardList } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getPendingRiders,
  getPendingShops,
  getVerifiedRiders,
  getVerifiedShops,
  getRiderDetails,
  getShopDetails,
  getAdminActivityLogs,
  getAdminComplaints,
  getAdminOrders,
  getAdminOverview,
  getAdminUsers,
  rejectRider,
  rejectShop,
  suspendRider,
  suspendShop,
  updateAdminComplaint,
  updateAdminUserStatus,
  unverifyRider,
  unverifyShop,
  verifyRider,
  verifyShop,
} from "../../api/adminApi";

const getId = (item) => item?._id || item?.id;

const VerificationCard = ({ item, type, verified, onDetails, onUnverify, onSuspend, unverifyLoading }) => {
  const isShop = type === "shop";
  const name = item.name || item.businessName || "Unnamed applicant";
  const secondary = isShop
    ? item.shopType || item.phone || "Shop application"
    : item.phoneNumber || item.userId || "Rider application";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-500">{secondary}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {verified ? "Verified" : "Pending"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onDetails(item, verified)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
      >
        <Eye size={18} />
        View full details
      </button>
      {verified && (
        <>
          <button type="button" disabled={unverifyLoading} onClick={() => onUnverify(getId(item), item)} className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-red-200 px-4 py-3 font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">
            {unverifyLoading ? "Unverifying..." : "Unverify"}
          </button>
          <button type="button" disabled={unverifyLoading} onClick={() => onSuspend(getId(item), item)} className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-orange-200 px-4 py-3 font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-60">
            {unverifyLoading ? "Updating..." : (item.status === "suspended" || item.isSuspended ? "Activate" : "Suspend")}
          </button>
        </>
      )}
    </article>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 wrap-break-word text-sm text-slate-900">{value || "Not provided"}</p>
  </div>
);

const ApplicationDetails = ({ application, onClose, onVerify, onReject, onUnverify, onSuspend, verifying }) => {
  if (!application) return null;

  const { item, type } = application;
  const isShop = type === "shop";
  const id = getId(item);
  const verified = application.verified;
  const phone = isShop ? item.phone : item.phoneNumber;
  const applicantName = item.name || item.businessName || "Applicant";
  const image = item.image || item.picture;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-600">Pending {isShop ? "shop" : "rider"} verification</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{applicantName}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close details">
            <X size={22} />
          </button>
        </div>

        {image && <img src={image} alt={`${applicantName} profile`} className="mt-6 h-48 w-full rounded-2xl object-cover" />}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <DetailRow label="Name" value={item.name} />
          <DetailRow label={isShop ? "Shop type" : "User ID"} value={isShop ? item.shopType : item.userId} />
          <DetailRow label="Phone" value={phone} />
          {isShop ? (
            <>
              <DetailRow label="Description" value={item.description} />
              <DetailRow label="Address" value={item.autoLocation?.formattedAddress} />
              <DetailRow label="Status" value={item.status} />
            </>
          ) : (
            <>
              <DetailRow label="Driving license" value={item.drivingLicenseNumber} />
              <DetailRow label="Availability" value={item.isAvailable ? "Available" : "Unavailable"} />
            </>
          )}
          <DetailRow label="Aadhaar number" value={item.aadharNumber} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Aadhaar document</p>
            {item.aadharImage ? <img src={item.aadharImage} alt="Aadhaar document" className="h-56 w-full rounded-xl border object-contain" /> : <div className="rounded-xl bg-slate-100 p-8 text-center text-sm text-slate-500">No Aadhaar image</div>}
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Applicant image</p>
            {image ? <img src={image} alt={`${applicantName} document`} className="h-56 w-full rounded-xl border object-contain" /> : <div className="rounded-xl bg-slate-100 p-8 text-center text-sm text-slate-500">No image</div>}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {phone && <a href={`tel:${phone}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"><Phone size={18} /> Call applicant</a>}
          {verified ? (
            <>
              <button type="button" disabled={verifying} onClick={() => onUnverify(type, id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">{verifying ? "Unverifying..." : "Unverify"}</button>
              <button type="button" disabled={verifying} onClick={() => onSuspend(type, id, item)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60">{item.status === "suspended" || item.isSuspended ? "Activate" : "Suspend"}</button>
            </>
          ) : (
            <>
              <button type="button" disabled={verifying} onClick={() => onReject(type, id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">Reject</button>
              <button type="button" disabled={verifying} onClick={() => onVerify(type, id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Check size={18} />{verifying ? "Verifying..." : `Verify ${isShop ? "shop" : "rider"}`}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminTools = ({ overview, users, orders, complaints, logs, search, setSearch, orderStatus, setOrderStatus, onUserStatus, onComplaintStatus, onSuspend }) => {
  const [tab, setTab] = useState("overview");
  const filteredUsers = users.filter((user) => !search || user.phone?.includes(search) || user.role?.includes(search));
  const filteredOrders = orders.filter((order) => !orderStatus || order.status === orderStatus);
  const money = Number(overview.revenue?.amount || 0).toLocaleString("en-IN");
  const tabs = [["overview", "Overview", ShieldCheck], ["users", "Users", Users], ["orders", "Orders", Package], ["complaints", "Complaints", MessageSquare], ["logs", "Activity logs", ClipboardList]];

  return <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {tabs.map(([key, label, Icon]) => <button key={key} type="button" onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><Icon size={16} />{label}</button>)}
    </div>

    {tab === "overview" && <div className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
      {[["Users", overview.users, Users], ["Shops", overview.shops, Store], ["Riders", overview.riders, Truck], ["Orders", overview.orders, Package], ["Pending shops", overview.pendingShops, Store], ["Pending riders", overview.pendingRiders, Truck], ["Open complaints", overview.openComplaints, MessageSquare], ["Paid revenue", `₹${money}`, IndianRupee]].map(([label, value, Icon]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><Icon className="text-emerald-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{value ?? 0}</p><p className="text-sm text-slate-500">{label}</p></div>)}
    </div>}

    {tab === "users" && <div className="pt-5"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by phone or role" className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500" /><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-3">Phone</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user._id} className="border-b"><td className="p-3">{user.phone}</td><td className="p-3">{user.role}</td><td className="p-3">{user.isBlocked ? "Blocked" : "Active"}</td><td className="p-3"><button type="button" onClick={() => onUserStatus(user)} className="rounded-lg border px-3 py-2 font-medium">{user.isBlocked ? "Unblock" : "Block"}</button></td></tr>)}</tbody></table></div></div>}

    {tab === "orders" && <div className="pt-5"><select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="mb-4 rounded-xl border border-slate-300 px-4 py-3"><option value="">All statuses</option>{["placed", "accepted", "preparing", "ready_for_rider", "rider_assigned", "picked_up", "delivered", "cancelled"].map((status) => <option key={status}>{status}</option>)}</select><div className="space-y-3">{filteredOrders.map((order) => <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 text-sm"><span className="font-semibold">#{order._id?.slice(-6)}</span><span>{order.shopName}</span><span>{order.status}</span><span>{order.paymentStatus}</span><b>₹{order.totalAmount || 0}</b></div>)}</div></div>}

    {tab === "complaints" && <div className="space-y-3 pt-5">{complaints.map((complaint) => <div key={complaint._id} className="rounded-xl bg-slate-50 p-4"><div className="flex flex-wrap justify-between gap-2"><b>{complaint.subject}</b><span className="text-sm text-slate-500">{complaint.status}</span></div><p className="mt-2 text-sm text-slate-600">{complaint.description}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => onComplaintStatus(complaint, "in_progress")} className="rounded-lg border px-3 py-2 text-sm">In progress</button><button type="button" onClick={() => onComplaintStatus(complaint, "resolved")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white">Resolve</button></div></div>)}</div>}

    {tab === "logs" && <div className="space-y-2 pt-5">{logs.map((log) => <div key={log._id} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{log.action}</b> · {log.entityType} {log.entityId ? `(${log.entityId.slice(-6)})` : ""}<span className="ml-2 text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>{log.reason && <p className="mt-1 text-slate-600">Reason: {log.reason}</p>}</div>)}</div>}
  </section>;
};

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [riders, setRiders] = useState([]);
  const [verifiedShops, setVerifiedShops] = useState([]);
  const [verifiedRiders, setVerifiedRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verifying, setVerifying] = useState("");
  const [application, setApplication] = useState(null);
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const loadApplications = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [shopResponse, riderResponse, verifiedShopResponse, verifiedRiderResponse, overviewResponse, userResponse, orderResponse, complaintResponse, logResponse] = await Promise.all([
        getPendingShops(),
        getPendingRiders(),
        getVerifiedShops(),
        getVerifiedRiders(),
        getAdminOverview(),
        getAdminUsers(),
        getAdminOrders(),
        getAdminComplaints(),
        getAdminActivityLogs(),
      ]);
      setShops(shopResponse.shops || []);
      setRiders(riderResponse.riders || []);
      setVerifiedShops(verifiedShopResponse.shops || []);
      setVerifiedRiders(verifiedRiderResponse.riders || []);
      setOverview(overviewResponse || {});
      setUsers(userResponse.users || []);
      setOrders(orderResponse.orders || []);
      setComplaints(complaintResponse.complaints || []);
      setLogs(logResponse.logs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleVerify = async (type, id) => {
    if (!id) {
      toast.error("This application has no valid ID");
      return;
    }

    const reason = window.prompt("Optional approval note:") || "";
    setVerifying(`${type}:${id}`);
    try {
      if (type === "shop") await verifyShop(id, reason);
      else await verifyRider(id, reason);
      toast.success(`${type === "shop" ? "Shop" : "Rider"} verified successfully`);
      if (type === "shop") setShops((current) => current.filter((item) => getId(item) !== id));
      else setRiders((current) => current.filter((item) => getId(item) !== id));
      setApplication(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setVerifying("");
    }
  };

  const handleReject = async (type, id) => {
    const reason = window.prompt(`Why are you rejecting this ${type}?`);
    if (!reason?.trim()) return;
    setVerifying(`${type}:${id}`);
    try {
      if (type === "shop") await rejectShop(id, reason); else await rejectRider(id, reason);
      toast.success(`${type === "shop" ? "Shop" : "Rider"} rejected`);
      if (type === "shop") setShops((current) => current.filter((item) => getId(item) !== id)); else setRiders((current) => current.filter((item) => getId(item) !== id));
      setApplication(null);
    } catch (error) { toast.error(error.response?.data?.message || "Rejection failed"); } finally { setVerifying(""); }
  };

  const handleUserStatus = async (user) => {
    const blocked = !user.isBlocked;
    const reason = blocked ? window.prompt("Block reason:") : "";
    if (blocked && !reason?.trim()) return;
    try { await updateAdminUserStatus(user._id, blocked, reason); setUsers((current) => current.map((item) => item._id === user._id ? { ...item, isBlocked: blocked } : item)); toast.success(blocked ? "User blocked" : "User unblocked"); } catch (error) { toast.error(error.response?.data?.message || "Unable to update user"); }
  };

  const handleComplaintStatus = async (complaint, status) => {
    try { await updateAdminComplaint(complaint._id, { status }); setComplaints((current) => current.map((item) => item._id === complaint._id ? { ...item, status } : item)); toast.success("Complaint updated"); } catch (error) { toast.error(error.response?.data?.message || "Unable to update complaint"); }
  };

  const handleUnverify = async (type, id, selectedItem = application?.item) => {
    if (!id || !window.confirm(`Are you sure you want to unverify this ${type}?`)) return;

    setVerifying(`${type}:${id}`);
    try {
      if (type === "shop") {
        await unverifyShop(id);
        setVerifiedShops((current) => current.filter((item) => getId(item) !== id));
        setShops((current) => [...current, selectedItem].filter(Boolean));
      } else {
        await unverifyRider(id);
        setVerifiedRiders((current) => current.filter((item) => getId(item) !== id));
        setRiders((current) => [...current, selectedItem].filter(Boolean));
      }
      toast.success(`${type === "shop" ? "Shop" : "Rider"} moved back to pending`);
      setApplication(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to unverify");
    } finally {
      setVerifying("");
    }
  };

  const handleSuspend = async (type, id, selectedItem) => {
    const currentlySuspended = selectedItem?.status === "suspended" || selectedItem?.isSuspended === true;
    const reason = currentlySuspended ? "" : window.prompt(`Why are you suspending this ${type}?`);
    if (!currentlySuspended && !reason?.trim()) return;
    setVerifying(`${type}:${id}`);
    try {
      if (type === "shop") await suspendShop(id, !currentlySuspended, reason || "");
      else await suspendRider(id, !currentlySuspended, reason || "");
      const update = (item) => getId(item) === id ? (type === "shop" ? { ...item, status: currentlySuspended ? "approved" : "suspended" } : { ...item, isSuspended: !currentlySuspended }) : item;
      if (type === "shop") setVerifiedShops((current) => current.map(update)); else setVerifiedRiders((current) => current.map(update));
      if (application?.item && getId(application.item) === id) setApplication((current) => ({ ...current, item: update(current.item) }));
      toast.success(`${type === "shop" ? "Shop" : "Rider"} ${currentlySuspended ? "activated" : "suspended"}`);
    } catch (error) { toast.error(error.response?.data?.message || "Unable to update suspension"); } finally { setVerifying(""); }
  };

  const openDetails = async (item, type, verified = false) => {
    setApplication({ item, type, verified });
    try {
      const details = type === "shop" ? await getShopDetails(getId(item)) : await getRiderDetails(getId(item));
      if (details) setApplication({ item: details, type, verified });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load full details");
    }
  };

  const section = (title, Icon, items, type, verified = false) => (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <Icon className="text-emerald-600" size={22} />
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No pending {type} applications.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const id = getId(item);
            return (
              <VerificationCard
                key={id}
                item={item}
                type={type}
                verified={verified}
                onDetails={(selectedItem, isVerified) => openDetails(selectedItem, type, isVerified)}
                onUnverify={(itemId) => handleUnverify(type, itemId)}
                onSuspend={(itemId, selectedItem) => handleSuspend(type, itemId, selectedItem)}
                unverifyLoading={verifying === `${type}:${id}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-600" size={30} />
              <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
            </div>
            <p className="mt-2 text-slate-600">Review and verify new shops and delivery riders.</p>
          </div>
          <button
            type="button"
            onClick={() => loadApplications(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading applications...</div>
        ) : (
          <div className="space-y-10">
            {section("Pending shops", Store, shops, "shop")}
            {section("Pending riders", Truck, riders, "rider")}
            {section("Verified shops", Store, verifiedShops, "shop", true)}
            {section("Verified riders", Truck, verifiedRiders, "rider", true)}
          </div>
        )}
      </div>
      <ApplicationDetails
        application={application}
        onClose={() => setApplication(null)}
        onVerify={handleVerify}
        onReject={handleReject}
        onUnverify={handleUnverify}
        onSuspend={handleSuspend}
        verifying={application ? verifying === `${application.type}:${getId(application.item)}` : false}
      />
      <AdminTools overview={overview} users={users} orders={orders} complaints={complaints} logs={logs} search={search} setSearch={setSearch} orderStatus={orderStatus} setOrderStatus={setOrderStatus} onUserStatus={handleUserStatus} onComplaintStatus={handleComplaintStatus} />
    </main>
  );
};

export default Dashboard;
