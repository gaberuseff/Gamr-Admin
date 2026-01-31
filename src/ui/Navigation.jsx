import { Badge } from "@heroui/react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { HiOutlineCog8Tooth, HiOutlineSquares2X2, HiOutlineUser } from "react-icons/hi2";
import { TbShoppingBagDiscount } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { useNewOrders } from "../contexts/NewOrdersContext";

function Navigation() {
  const { newOrdersCount, resetNewOrders } = useNewOrders();

  const routes = [
    { name: "لوحة التحكم", path: "/dashboard", icon: HiOutlineSquares2X2 },
    { name: "الطلبات", path: "/orders", icon: HiOutlineShoppingBag },
    { name: "المنتجات", path: "/products", icon: TbShoppingBagDiscount },
    { name: "المستخدمين", path: "/users", icon: HiOutlineUser },
    { name: "الإعدادات", path: "/settings", icon: HiOutlineCog8Tooth },
  ];

  const handleOrdersClick = () => {
    resetNewOrders();
  };

  return (
    <nav className="flex space-x-2">
      {routes.map((route) => {
        const Icon = route.icon;
        const isOrdersRoute = route.path === "/orders";

        const badgeContent = isOrdersRoute && newOrdersCount > 0 ? (
          <Badge
            content={newOrdersCount}
            color="danger"
            placement="top-right"
            size="md"
          >
            <NavLink
              key={route.path}
              to={route.path}
              onClick={isOrdersRoute ? handleOrdersClick : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-full 
                  py-3 px-4 transition-colors duration-200 text-sm lg:text-base
                  ${isActive
                  ? "bg-gray-800 text-white"
                  : "bg-bg-secondary text-text hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {Icon ? <Icon className="text-xl" aria-hidden="true" /> : null}
              <span className="font-semibold">{route.name}</span>
            </NavLink>
          </Badge>
        ) : (
          <NavLink
            key={route.path}
            to={route.path}
            onClick={isOrdersRoute ? handleOrdersClick : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-full 
                py-3 px-4 transition-colors duration-200 text-sm lg:text-base
                ${isActive
                ? "bg-gray-800 text-white"
                : "bg-bg-secondary text-text hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {Icon ? <Icon className="text-xl lg:block hidden" aria-hidden="true" /> : null}
            <span className="font-semibold">{route.name}</span>
          </NavLink>
        );

        return badgeContent;
      })}
    </nav>
  );
}

export default Navigation;
