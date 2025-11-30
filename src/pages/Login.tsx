import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import useAuthStore from "../stores/useAuthStore";
import useToastStore from "../stores/useToastStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state: any) => state.login);
  const { showSuccess, showError } = useToastStore();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      login({
        avatarUrl: user.photoURL || "/default.webp",
        displayName: user.displayName || "未命名",
        email: user.email || "",
      });

      showSuccess("Google 登入成功！");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error: any) {
      showError("Google 登入失敗：" + (error?.message || String(error)));
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <button className="btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}
