import { SignIn } from "@clerk/nextjs";

const WorkerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl" role="img" aria-label="Worker">
              👷
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Worker Sign In
          </h2>
          <p className="text-gray-600">Access your worker dashboard</p>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <SignIn
            path="/login/worker"
            routing="path"
            signUpUrl="/register"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200",
                card: "shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50 transition-colors duration-200",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
