import { HiOutlineShoppingBag } from "react-icons/hi";
import { HiOutlineCog8Tooth, HiOutlineSquares2X2 } from "react-icons/hi2";
import { TbShoppingBagDiscount } from "react-icons/tb";
import { NavLink } from "react-router-dom";

function Navigation() {
  const routes = [
    { name: "لوحة التحكم", path: "/dashboard", icon: HiOutlineSquares2X2 },
    { name: "الطلبات", path: "/orders", icon: HiOutlineShoppingBag },
    { name: "المنتجات", path: "/products", icon: TbShoppingBagDiscount },
    { name: "الإعدادات", path: "/settings", icon: HiOutlineCog8Tooth },
  ];

  return (
    <div>
      <nav className="flex space-x-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-full 
                py-3 px-4 transition-colors duration-200
                ${isActive
                  ? "bg-gray-800 text-white"
                  : "bg-bg-secondary text-text hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {Icon ? <Icon className="text-xl" aria-hidden="true" /> : null}
              <span className="font-semibold">{route.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default Navigation;
