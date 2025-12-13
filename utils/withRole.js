import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withRole(Component, allowedRoles = []) {
  return function ProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      const role = localStorage.getItem("userRole");

      if (!role || !allowedRoles.includes(role)) {
        router.replace("/logIn");
      }
    }, []);

    return <Component {...props} />;
  };
}
