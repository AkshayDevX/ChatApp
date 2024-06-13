const isAuthenticated = () => {
    const user = localStorage.getItem("chatAppUser");
    if (user === "isAuthenticated") {
      return true;
    } else {
      return false;
    }
  };
  
  export default isAuthenticated;
  