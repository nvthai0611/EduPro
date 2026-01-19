import { useQuery } from '@tanstack/react-query';

async function fetchAdmin() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_API_V1}/auth/login/admin`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (res.status === 401) {
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error('Lỗi kết nối');
  }

  return res.json();
}

export default function LoginPage() {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['admin-auth'],
    queryFn: fetchAdmin,
    retry: false,
  });

  if (isLoading) return <div></div>;

  const isProduction = import.meta.env.VITE_PROD === "production";
  const cookieOptions = `path=/; max-age=86400; ${isProduction ? "secure; samesite=none" : "samesite=lax"
    }`;
  document.cookie = `render_id=${data.render_id}; ${cookieOptions}`;
  document.cookie = `runtime_ctx=${data.runtime_ctx}; ${cookieOptions}`;

  window.location.href = "/";

  return null;
}


