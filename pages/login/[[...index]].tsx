import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600">
            Choose your account type to continue
          </p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <div className="space-y-4">
            <Link href="/login/worker" className="block">
              <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105">
                <span className="mr-2" role="img" aria-label="Worker">
                  👷
                </span>
                Login as Worker
              </button>
            </Link>
            <Link href="/login/employer" className="block">
              <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105">
                <span className="mr-2" role="img" aria-label="Employer">
                  🏢
                </span>
                Login as Employer
              </button>
            </Link>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              New to the platform?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
