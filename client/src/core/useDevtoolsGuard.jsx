import { useEffect, useRef } from "react";

export default function useDevtoolsGuard() {
  const destroyedRef = useRef(false);

  const isProd = import.meta.env.VITE_PROD === 'production';

  const isMobileOrTablet = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isDevToolsOpen = () => {
    const threshold = 160;
    return (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    );
  };

  const destroyRoot = () => {
    if (destroyedRef.current) return;
    destroyedRef.current = true;

    const root = document.getElementById("root");
    if (!root) return;

    root.innerHTML = `
      <div style="
        position:fixed;
        inset:0;
        background:#1e212e;
        color:#fff;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        font-size:1.8rem;
        font-weight:600;
        z-index:999999;
      ">
        <img src="https://goatembed.com/images/denied.gif"
             style="width:180px;border-radius:15%;margin-bottom:1rem"/>
        <div>Có lỗi xảy ra</div>
        <div style="font-size:1.2rem;margin-top:.5rem">
          Vui lòng Refresh lại trang để tiếp tục
        </div>
      </div>
    `;

    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!isProd) return;

    // mobile / tablet → bỏ qua
    if (isMobileOrTablet()) return;

    const check = () => {
      if (isDevToolsOpen()) {
        destroyRoot();
      }
    };

    const resizeHandler = () => {
      clearTimeout(window.__devtoolsTimer);
      window.__devtoolsTimer = setTimeout(check, 300);
    };

    window.addEventListener("resize", resizeHandler);
    const interval = setInterval(check, 1500);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearInterval(interval);
    };
  }, [isProd]);
}
