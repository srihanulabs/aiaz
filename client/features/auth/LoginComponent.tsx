"use client";
import useLogin from "./hooks/useLogin";

export default function LoginComponent() {
  const { handleSubmit, updateCredentials, register } = useLogin();
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(updateCredentials)}>
        <div className="grid grid-cols-1 gap-2">
          <div>Username</div>
          <div>
            <input
              type="text"
              placeholder="Username"
              className="border rounded-sm p-2"
              {...register("userName")}
            />
          </div>
          <div>Password</div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="border rounded-sm p-2"
              {...register("password")}
            />
          </div>
          <div>
            {" "}
            <input
              type="submit"
              value="Login"
              className="bg-blue-500 text-white px-4 py-2 rounded-sm"
            />
          </div>
          <div></div>
          <div></div>
        </div>
      </form>
    </div>
  );
}
