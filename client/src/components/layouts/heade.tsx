import useLogoutMutation from "../../actions/user/logoutUser";

const Header = () => {
  const { mutate: logout } = useLogoutMutation();

  return (
    <>
      <div className="navbar p-5 bg-base-100 mx-auto max-w-7xl">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">ChatApp</a>
        </div>
        <div className="navbar-end">
          <a className="btn" onClick={() => logout()}>logout</a>
        </div>
      </div>
    </>
  );
};

export default Header;
