import React, { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useToastStore from "../stores/useToastStore";
import type { User } from "../types";

export default function Profile() {
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastStore();

  useEffect(() => {
    if (!isLoggedIn && !user) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  if (!user) {
    return <div className="text-center mt-10">尚未登入</div>;
  }

  const u = user as User | null;

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      useAuthStore.getState().logout();
      navigate("/");
      showSuccess("Google 登出成功！");
    } catch (error: unknown) {
      const msg = (error as { message?: string })?.message ?? String(error);
      showError("Google 登出失敗：" + msg);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <img src={u?.avatarUrl || "https://i.pravatar.cc/100"} alt="User Avatar" style={{ width: 100, height: 100, borderRadius: "50%" }} />
      <h2 className="text-2xl font-bold mt-4">{u?.displayName}</h2>
      <p className="mt-2">{u?.email}</p>
      <button className="btn btn-error mt-6" onClick={handleLogout}>
        登出
      </button>
    </div>
  );
}
