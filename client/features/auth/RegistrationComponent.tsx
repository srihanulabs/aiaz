export default function RegistrationComponent() {
  return (
    <div className="w-2/4">
      <h1 className="font-semibold text-2xl mb-2">Registration Component</h1>
      <p className="py-3">
        This is the Registration Component. It is a form that allows users to
        register with the application.
      </p>
      <form className="">
        <div className="grid grid-cols-1 gap-2 will-change-contents border border-blue-700 rounded p-2">
          <div className="flex justify-between">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="border rounded-sm px-1"
              autoComplete="false"
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              className="border rounded-sm px-1"
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="border rounded-sm  px-1"
              px-1
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="border rounded-sm px-1"
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="repeatPassword">Repeat Password</label>
            <input
              type="password"
              id="repeatPassword"
              className="border rounded-sm px-1"
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="repeatPassword"
              className="border rounded-sm px-1"
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div>
              <input
                type="text"
                id="countryCode"
                className="border rounded-sm w-10 px-1"
              />

              <input
                type="text"
                id="phoneNumber"
                className="border rounded-sm px-1"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div></div>
            <input
              type="submit"
              value="Signup"
              className="border border-green-800 rounded-sm bg-green-300 p-1 py-0 hover:cursor-pointer text-black"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
