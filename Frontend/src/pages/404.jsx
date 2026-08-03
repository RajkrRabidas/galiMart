import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 text-7xl font-black text-emerald-600">404</div>
        <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-emerald-600 px-4 py-2 font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
