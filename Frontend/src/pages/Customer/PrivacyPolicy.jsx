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
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>Welcome to GaliMart.</p>
        <p>GaliMart is a hyperlocal marketplace platform that connects customers with local shops, delivery partners and service providers.</p>
        <p>This Privacy Policy explains how GaliMart collects, uses, stores, processes and shares your personal information when you use our mobile application, website and related services.</p>
        <p>By using GaliMart, you acknowledge that you have read this Privacy Policy.</p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <p>We may collect the following categories of information depending on the features you use.</p>
        <p><strong>A. Personal Information</strong></p>
        <ul>
          <li>Full name</li>
          <li>Mobile phone number</li>
          <li>Email address (if provided or obtained through Google Sign-In)</li>
          <li>Profile photograph</li>
          <li>Account ID</li>
          <li>User role (Customer, Shopkeeper, Delivery Partner or Service Provider)</li>
        </ul>
        <p><strong>B. Address Information</strong></p>
        <ul>
          <li>House number and street address</li>
          <li>City, district and state</li>
          <li>PIN code</li>
          <li>Delivery address</li>
          <li>Saved addresses</li>
        </ul>
        <p><strong>C. Location Information</strong></p>
        <p>With your permission, GaliMart may collect your device&apos;s location to:</p>
        <ul>
          <li>Find nearby shops and services.</li>
          <li>Calculate delivery distance.</li>
          <li>Show available services in your area.</li>
          <li>Help delivery partners navigate to delivery destinations.</li>
          <li>Provide order tracking functionality.</li>
        </ul>
        <p>Location access is requested when required by the relevant feature. Background location collection, if implemented, will be separately disclosed and requested with the necessary permissions.</p>
        <p><strong>D. Transaction Information</strong></p>
        <p>When you place orders or make payments, we may process:</p>
        <ul>
          <li>Order details</li>
          <li>Purchased products and services</li>
          <li>Transaction IDs</li>
          <li>Payment status</li>
          <li>Billing and delivery information</li>
          <li>Refund information</li>
        </ul>
        <p>Payment card details and sensitive payment credentials are handled by the applicable payment service provider, where supported, and are not intended to be stored directly by GaliMart.</p>
        <p><strong>E. User-Generated Information</strong></p>
        <ul>
          <li>Shop names and descriptions</li>
          <li>Shop logos and banners</li>
          <li>Product images</li>
          <li>Service descriptions</li>
          <li>Reviews and ratings</li>
          <li>Uploaded business documents, where required</li>
          <li>Customer support messages</li>
        </ul>
        <p><strong>F. Device and Technical Information</strong></p>
        <ul>
          <li>Device model</li>
          <li>Operating system</li>
          <li>App version</li>
          <li>IP address</li>
          <li>Device and diagnostic information</li>
          <li>Crash reports and technical logs, where enabled</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>We use collected information to:</p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Create and manage user accounts.</li>
          <li>Verify phone numbers through OTP authentication.</li>
          <li>Support Google Sign-In, if enabled.</li>
          <li>Process orders and service bookings.</li>
          <li>Connect customers with shops and service providers.</li>
          <li>Assign and manage delivery partners.</li>
          <li>Calculate delivery distances and display nearby businesses.</li>
          <li>Process payments and refunds through payment providers.</li>
          <li>Send order updates and important notifications.</li>
          <li>Prevent fraud, unauthorized access and misuse.</li>
          <li>Improve application performance and user experience.</li>
          <li>Respond to customer support requests.</li>
          <li>Comply with applicable legal obligations.</li>
        </ol>
      </>
    ),
  },
  {
    id: "user-roles",
    title: "4. User Roles and Information Sharing",
    content: (
      <>
        <p>GaliMart supports multiple user roles.</p>
        <p><strong>Customers</strong></p>
        <p>Customer information necessary to fulfil an order may be shared with the relevant shopkeeper and assigned delivery partner.</p>
        <p><strong>Shopkeepers</strong></p>
        <p>Shopkeepers may access the customer information necessary to prepare and fulfil orders assigned to their shops.</p>
        <p><strong>Delivery Partners</strong></p>
        <p>Delivery partners may receive relevant customer contact, delivery address and order information to complete assigned deliveries.</p>
        <p><strong>Service Providers</strong></p>
        <p>Service providers may receive customer information necessary to fulfil accepted service bookings.</p>
        <p><strong>Administrators</strong></p>
        <p>Authorized GaliMart administrators may access information necessary for platform management, verification, customer support, fraud prevention and dispute resolution.</p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "5. Third-Party Services",
    content: (
      <>
        <p>GaliMart may use third-party service providers to operate its platform.</p>
        <p>These may include:</p>
        <ul>
          <li><strong>MongoDB Atlas:</strong> Database hosting</li>
          <li><strong>Hostinger:</strong> Server and website hosting</li>
          <li><strong>Cloudinary:</strong> Image and media storage</li>
          <li><strong>Google Maps Platform:</strong> Maps and location services</li>
          <li><strong>Firebase / MSG91:</strong> OTP authentication, if integrated</li>
          <li><strong>Google Sign-In:</strong> Google account authentication, if enabled</li>
          <li><strong>Razorpay / other payment gateway:</strong> Payment processing, if integrated</li>
        </ul>
        <p>These providers may process relevant information to provide their services under their applicable terms and privacy policies.</p>
        <p>We do not sell users&apos; personal and sensitive information.</p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "6. Data Security",
    content: (
      <>
        <p>We take reasonable technical and organizational measures to protect user information against unauthorized access, alteration, disclosure, loss or misuse.</p>
        <p>Security measures may include:</p>
        <ul>
          <li>HTTPS encryption for data transmission.</li>
          <li>Secure authentication mechanisms.</li>
          <li>Access control and role-based permissions.</li>
          <li>Protected database access.</li>
          <li>Secure handling of authentication tokens.</li>
          <li>Restricted access to administrative information.</li>
        </ul>
        <p>However, no electronic storage or transmission method can be guaranteed to be completely secure.</p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "7. Data Retention",
    content: (
      <>
        <p>We retain personal information only for as long as necessary to:</p>
        <ul>
          <li>Provide our services.</li>
          <li>Maintain user accounts.</li>
          <li>Complete orders and transactions.</li>
          <li>Resolve disputes.</li>
          <li>Prevent fraud and security issues.</li>
          <li>Comply with applicable legal and regulatory requirements.</li>
        </ul>
        <p>When information is no longer required, we will take reasonable steps to delete or anonymize it, subject to applicable legal retention obligations.</p>
      </>
    ),
  },
  {
    id: "account-deletion",
    title: "8. Account Deletion",
    content: (
      <>
        <p>Users can request deletion of their GaliMart accounts.</p>
        <p>Account deletion can be requested through:</p>
        <p><strong>In-App:</strong> Profile → Settings → Delete Account.</p>
        <p><strong>Website:</strong> <a className="font-semibold text-emerald-700 underline underline-offset-4" href="https://www.galimart.co.in">https://www.galimart.co.in</a></p>
        <p><strong>Email:</strong> <a className="font-semibold text-emerald-700 underline underline-offset-4" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a></p>
        <p>Upon receiving a valid deletion request, we will delete the associated personal information unless certain information must be retained for legal, regulatory, security, fraud-prevention or transaction-related purposes.</p>
        <p>Where retention is legally required, we will restrict the use of such information to the applicable purpose and retain it only for the required period.</p>
        <p>Deleting an account may permanently remove access to account history and associated services.</p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "9. User Rights",
    content: (
      <>
        <p>Depending on applicable laws, users may request to:</p>
        <ul>
          <li>Access their personal information.</li>
          <li>Correct inaccurate information.</li>
          <li>Update their profile.</li>
          <li>Request deletion of their account and associated data.</li>
          <li>Raise concerns about data processing.</li>
          <li>Withdraw consent where applicable.</li>
        </ul>
        <p>Users can contact us using the details below.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: (
      <>
        <p>GaliMart is not intended for children under the age of 18.</p>
        <p>We do not knowingly collect personal information from children in violation of applicable laws.</p>
        <p>If we become aware that personal information has been collected from a child inappropriately, we will take reasonable steps to address and delete such information.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to This Privacy Policy",
    content: (
      <>
        <p>We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements or data-handling practices.</p>
        <p>Updated policies will be published on this page with a revised Last Updated date.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Information",
    content: (
      <>
        <p>For privacy-related questions, complaints or requests, contact us:</p>
        <ul>
          <li><strong>Application Name:</strong> GaliMart</li>
          <li><strong>Website:</strong> <a className="font-semibold text-emerald-700 underline underline-offset-4" href="https://www.galimart.co.in">https://www.galimart.co.in</a></li>
          <li><strong>Business / Developer Name:</strong> GaliMart</li>
          <li><strong>Privacy Contact Email:</strong> <a className="font-semibold text-emerald-700 underline underline-offset-4" href="mailto:galimart03@gmail.com">galimart03@gmail.com</a></li>
          <li><strong>Contact Number:</strong>+91 6290 392 522</li>
          <li><strong>Business Address:</strong>Howrah, West Bengal</li>
        </ul>
      </>
    ),
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-100">
    <main className="mx-auto max-w-5xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
      <Link
        to="/settings"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
      >
        <ArrowLeft size={17} /> Back to Settings
      </Link>

      <header className="relative overflow-hidden rounded-4xl bg-emerald-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
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
          <p className="mt-5 text-xs font-medium text-emerald-100/70">Last updated: 24 November 2026</p>
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