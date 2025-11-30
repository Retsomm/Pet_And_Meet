import Navbar from "./Navbar";
import Dock from "./Dock";
import { Outlet } from "react-router";
export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex flex-col sm:justify-center items-center z-0 sm:mt-10 m-3">
        <Outlet />
      </main>
      <Dock />
    </div>
  );
}
