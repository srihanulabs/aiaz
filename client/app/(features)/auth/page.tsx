import RegistrationComponent from "@/features/auth/RegistrationComponent";

export default function AuthPage() {
  return (
    <div className="flex flex-col min-h-screen py-2">
      <div className="border rounded-lg p-4 flex flex-col items-center h-screen justify-center">
        <RegistrationComponent />
      </div>
    </div>
  );
}
