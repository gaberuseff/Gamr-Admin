import Logout from "../features/auth/Logout";
import UserAvatar from "../features/auth/UserAvatar";
import Logo from "./Logo";
import Navigation from "./Navigation";

function Header() {
  return (
    <div className="py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-7">
        <Logo />
        <Navigation />
      </div>

      <div className="flex items-center space-x-7">
        <UserAvatar />
        <Logout />
      </div>
    </div>
  );
}

export default Header;
