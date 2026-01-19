import { SignIn } from "@clerk/nextjs";

const EmployerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-2xl" role="img" aria-label="Employer">
              🏢
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Employer Sign In
          </h2>
          <p className="text-gray-600">Manage your projects and find talent</p>
        </div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <SignIn
            path="/login/employer"
            routing="path"
            signUpUrl="/register"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200",
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

export default EmployerLogin;
