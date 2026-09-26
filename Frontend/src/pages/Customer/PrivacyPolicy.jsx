import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: (
      <>
        <p>Depending on how you use GaliMart, we may collect these categories of information:</p>
        <ul>
          <li><strong>Account and contact details:</strong> your mobile number, account role, and any name or email address you choose to add to your profile or delivery address. We use a one-time password (OTP) to verify your number.</li>
          <li><strong>Delivery and location details:</strong> saved delivery addresses and, when you choose a location feature or provide an address, the address text and associated map coordinates. Your browser or device asks permission before sharing its current location.</li>
          <li><strong>Marketplace activity:</strong> cart contents, products or services viewed or ordered, order status, delivery instructions, and related customer-service messages.</li>
          <li><strong>Transaction details:</strong> order totals, payment method, and payment status or references. Online payments are handled through Razorpay; GaliMart does not ask you to provide or store your full card number or card security code in the app.</li>
          <li><strong>Device and technical information:</strong> information sent automatically when you use the app or website, such as IP address, browser/device type, logs, and session or security data. Our hosting and service providers may also process technical logs.</li>
          <li><strong>Partner and shop information:</strong> if you register as a shopkeeper or service provider, we may collect business contact and location details, profile images, and documents submitted for verification (which may include government identity information).</li>
        </ul>
        <p>Please do not submit sensitive personal information unless it is specifically requested and needed for the service.</p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "2. How we use information",
    content: (
      <>
        <p>We use information as needed to operate and improve GaliMart, including to:</p>
        <ul>
          <li>create and secure accounts, verify phone numbers, and provide customer support;</li>
          <li>show nearby shops or services, find and format an address, and prepare or deliver orders;</li>
          <li>manage carts, bookings, orders, payments, refunds, and order updates;</li>
          <li>share the minimum practical order and delivery details with the relevant shop and delivery partner;</li>
          <li>verify shop or service-provider applications, prevent fraud or misuse, and protect users and the platform;</li>
          <li>diagnose errors, maintain service reliability, meet legal obligations, and enforce our terms; and</li>
          <li>send service messages such as OTPs and important order or account updates. We will seek any consent required for optional promotional messages.</li>
        </ul>
      </>
    ),
  },
  {
    id: "location",
    title: "3. Location and address information",
    content: (
      <>
        <p>GaliMart only accesses your device's current location when you choose a location feature and grant permission. You can deny or later revoke that permission in your browser or device settings; some delivery or nearby-shop features may then be limited.</p>
        <p>When you use address lookup, coordinates may be sent to OpenStreetMap's Nominatim service to return a readable address. If that service is unavailable and configured, Google Maps may be used as a fallback. A location you save as a delivery address is stored with your account so it can be used for future orders. You can manage saved addresses in the app.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. When information is shared",
    content: (
      <>
        <p>We do not sell personal information. We share information only as appropriate to provide the service, protect people, or comply with law:</p>
        <ul>
          <li><strong>Shops and delivery partners:</strong> order items, recipient name, delivery address, and contact details needed to accept, prepare, and deliver an order. A shop may also receive the details needed to fulfil a service booking.</li>
          <li><strong>Payment provider:</strong> Razorpay processes online payment details under its own terms and privacy notice. Payment data handled on its checkout may be subject to its practices.</li>
          <li><strong>OTP and messaging providers:</strong> your phone number and OTP delivery information may be sent to our configured SMS provider to verify your account and send requested service messages.</li>
          <li><strong>Infrastructure and feature providers:</strong> service providers that host or operate our database, cache, image storage, address lookup, maps, or app delivery may process information on our behalf.</li>
          <li><strong>Legal and safety purposes:</strong> information may be disclosed where required by law or where reasonably necessary to respond to valid legal requests, prevent fraud, or protect users, GaliMart, and the public.</li>
          <li><strong>Business changes:</strong> information may be transferred as part of a merger, financing, acquisition, or sale, subject to appropriate safeguards and applicable law.</li>
        </ul>
        <p>We do not control the privacy practices of independent shops, delivery partners, payment services, or external websites. Please review their notices when relevant.</p>
      </>
    ),
  },
  {
    id: "storage-security",
    title: "5. Storage, retention, and security",
    content: (
      <>
        <p>Your information may be stored in GaliMart's systems and those of our service providers. We keep it for as long as reasonably needed to provide the service, maintain account and transaction records, resolve disputes, prevent misuse, and meet legal or accounting requirements. Retention periods can vary by data type and legal obligations.</p>
        <p>We use reasonable technical and organizational measures intended to protect information. No website, app, or transmission method can be guaranteed completely secure, so please protect your device and account credentials and contact us if you suspect unauthorized access.</p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "6. Your choices and privacy requests",
    content: (
      <>
        <p>You can manage saved addresses and device location permissions in the app or your device settings. You may request access to, correction of, or deletion of personal information associated with your account, subject to identity checks and records we must retain by law.</p>
        <p>To make a privacy request or ask a question, email <a className="font-semibold text-emerald-700 underline underline-offset-4" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a> from your registered contact address or include your registered phone number. Do not email OTPs, passwords, or payment-card details. We will take reasonable steps to respond within the period required by applicable law.</p>
        <p>You can stop using GaliMart at any time. Signing out does not itself delete information already associated with your account or transaction records.</p>
      </>
    ),
  },
  {
    id: "cookies-and-device-storage",
    title: "7. Cookies and device storage",
    content: (
      <p>GaliMart uses browser or device storage for essential functions such as keeping you signed in, remembering selected settings, and retaining a location you chose to save on your device. You can clear this data through your browser or device settings, but some features may stop working or require you to sign in again. Our hosting or security providers may use technical logs to operate and protect the service.</p>
    ),
  },
  {
    id: "children",
    title: "8. Children's privacy",
    content: (
      <p>GaliMart is not intended for children who are not legally able to use the service or create an account under applicable law. We do not knowingly seek to collect children's personal information without the required consent. If you believe a child has provided personal information improperly, contact us so we can review the request.</p>
    ),
  },
  {
    id: "third-party-services",
    title: "9. Third-party services and links",
    content: (
      <p>Some features rely on third-party services, including payment checkout, SMS delivery, map/address lookup, and image or infrastructure hosting. Those providers may process information under their own privacy notices and terms. External links or maps are not operated by GaliMart; please review the relevant provider's policies before using them.</p>
    ),
  },
  {
    id: "changes-and-contact",
    title: "10. Changes and contact",
    content: (
      <>
        <p>We may update this policy as GaliMart or applicable requirements change. We will post the current version here and update the date below. If a change requires notice or consent under applicable law, we will take the appropriate steps.</p>
        <p><strong>Privacy contact:</strong> <a className="font-semibold text-emerald-700 underline underline-offset-4" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a></p>
        <p>This policy is intended to explain GaliMart's current app features in plain language; it is not legal advice. Please have the operating business verify and approve it before publication, especially the legal entity name, contact details, data retention, and applicable jurisdiction.</p>
      </>
    ),
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
    <main className="mx-auto max-w-5xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
      <Link
        to="/settings"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
      >
        <ArrowLeft size={17} /> Back to Settings
      </Link>

      <header className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <ShieldCheck size={30} className="text-emerald-300" />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">GaliMart · Your privacy matters</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50/80 sm:text-base">
            This policy explains what information may be collected when you use GaliMart, why it is used, and the choices available to you.
          </p>
          <p className="mt-5 text-xs font-medium text-emerald-100/70">Last updated: 26 September 2026</p>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">On this page</h2>
          <nav aria-label="Privacy policy sections" className="space-y-1">
            {sections.map(({ id, title }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                <span>{title}</span>
                <ChevronRight size={15} className="shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            ))}
          </nav>
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-5 text-emerald-950">
            <LockKeyhole size={18} className="mb-2 text-emerald-700" />
            Questions or privacy requests? Email <a className="font-bold underline underline-offset-2" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a>.
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-950">
            <MapPin className="mt-0.5 shrink-0 text-emerald-700" size={19} />
            <p>Location is used only when you choose a location feature and grant permission. You can manage saved delivery addresses in the app.</p>
          </div>
          {sections.map(({ id, title, content }) => (
            <section key={id} id={id} className="scroll-mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
              <div className="space-y-3 text-sm leading-7 text-gray-600 sm:text-base [&_li]:pl-1 [&_li]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_strong]:font-semibold [&_strong]:text-gray-800">
                {content}
              </div>
            </section>
          ))}
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center text-xs leading-5 text-gray-500">
            GaliMart Privacy Policy · For questions, contact <a className="font-semibold text-emerald-700 underline" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a>.
          </div>
        </div>
      </div>
    </main>
    <BottomNavbar />
  </div>
);

export default PrivacyPolicy;