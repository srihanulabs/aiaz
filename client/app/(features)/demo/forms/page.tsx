export default function FormsPage() {
  return (
    <div className="flex flex-col min-h-screen py-2">
      <header>
        <h1 className="text-2xl font-bold mb-4">User Registration Page</h1>
        <div className="border rounded-lg p-4 flex flex-col">
          <p className="text-gray-600">You can register as a new user here</p>
        </div>
      </header>
      <main>
        <form action="">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <br />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
          <br />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
          <br />
          <button type="submit">Register</button>
        </form>
      </main>
    </div>
  );
}
