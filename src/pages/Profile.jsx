import useAuthStore from "../stores/useAuthStore";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import useToastStore from "../stores/useToastStore";
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
  const handleLogout = async () => {
    try {
      //1. 登出 Firebase Auth
      const auth = getAuth();
      await signOut(auth);
      //2. 清除本地狀態
      useAuthStore.getState().logout();
      //3. 導回首頁
      navigate("/");
      showSuccess("Google 登出成功！");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      showError("Google 登出失敗：" + error.message);
    }
  };
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <img
        src={user.avatarUrl || "https://i.pravatar.cc/100"}
        alt="User Avatar"
        style={{ width: 100, height: 100, borderRadius: "50%" }}
      />
      <h2 className="text-2xl font-bold mt-4">{user.displayName}</h2>
      <p className="mt-2">{user.email}</p>
      <button className="btn btn-error mt-6" onClick={handleLogout}>
        登出
      </button>
    </div>
  );
}
