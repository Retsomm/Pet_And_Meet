import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";
import useAuthStore from "../stores/useAuthStore";

export default function Navbar() {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 l-0 z-50 max-sm:hidden p-0">
      <div className="flex-1 mx-10">
        <img src="/PetIcon.webp" alt="PetIcon" className="w-12 h-auto" />
      </div>
      <div className="flex-none mx-10">
        <ul className="menu menu-horizontal px-1 items-center">
          <li>
            <Link to="/" className="navLink" aria-label="首頁">
              <p className="text-lg font-bold">首頁</p>
            </Link>
          </li>
          <li>
            <Link to="/data" className="navLink" aria-label="資料庫">
              <p className="text-lg font-bold">毛孩們</p>
            </Link>
          </li>
          <li>
            <Link to="/collect" className="navLink" aria-label="收藏">
              <p className="text-lg font-bold">收藏</p>
            </Link>
          </li>
          
          <li>
            {isLoggedIn ? (
              <Link to="/profile" className="navLink" aria-label="個人資料">
                <img
                  src={user?.avatarUrl || "https://i.pravatar.cc/40"}
                  alt="User Avatar"
                  className="w-12 h-auto cursor-pointer"
                />
              </Link>
            ) : (
              <Link to="/login" className="navLink" aria-label="登入">
                <p className="text-lg font-bold">登入</p>
              </Link>
            )}
          </li>
          <li>
            <div
              className="navLink flex items-center tooltip tooltip-bottom"
              data-tip="switchTheme"
            >
              <span className="text-sm"></span>
              <ThemeToggle />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
