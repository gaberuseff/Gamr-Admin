import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-2 hidden lg:block" />
    </Link>
  );
}

export default Logo;
