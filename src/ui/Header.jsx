import UserAvatar from "../features/auth/UserAvatar";
import Logo from "./Logo";
import Navigation from "./Navigation";

function Header() {

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-7">
        <Logo />
        <Navigation />
      </div>

      <UserAvatar />
    </div>
  );
}

export default Header;
