import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <img src="/logo.png" alt="Logo" className="inline-block w-12 h-12 mr-2" />
    </Link>
  );
}

export default Logo;
