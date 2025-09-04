import { useNavigate } from "react-router";
export default function Hero() {
  const navigate = useNavigate();
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url('/Cat.webp')`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">毛孩相遇站</h1>
          <h3 className="mb-5 text-xl font-bold">給迷路的牠，一個溫暖的家。</h3>
          <div className="btn btn-primary" onClick={() => navigate("/data")}>
            Get Started
          </div>
        </div>
      </div>
    </div>
  );
}
