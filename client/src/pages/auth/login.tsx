import { Link } from "@tanstack/react-router";
import useLoginUserMutation from "../../actions/user/loginUser";

const Login = () => {
  const { mutate: login, isPending} = useLoginUserMutation();

  // Handle login form submission
  const handleLogin = (e: any) => {
    e.preventDefault();
    login({
      email: e.target.email.value,
      password: e.target.password.value,
    });
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin}>
          <div className="flex flex-col w-96 p-10 rounded-lg shadow-lg justify-center items-center">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

            <label className="input input-bordered flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input type="text" className="grow" name="email" required placeholder="Email" />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input type="password" name="password" required className="grow" placeholder="Password" />
            </label>
            <button className="btn btn-md min-w-36 mb-4" disabled={isPending}>Login{isPending && <span className="loading loading-spinner loading-sm"></span>}</button>
            <p className="text-sm">
              don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
