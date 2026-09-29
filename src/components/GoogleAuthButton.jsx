import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

/**
 * Props:
 *   role      - "student" | "college_rep" — pass whatever the page's
 *               Student/College Rep toggle currently has selected. Only
 *               used server-side if this Google account is signing up
 *               for the first time; ignored on an existing account.
 *   onSuccess - (user) => void — e.g. navigate("/")
 *   onError   - (message) => void — show it wherever the page shows errors
 */
export default function GoogleAuthButton({ role, onSuccess, onError }) {
  const { googleLogin } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const user = await googleLogin(credentialResponse.credential, role);
          onSuccess?.(user);
        } catch (err) {
          onError?.(err.response?.data?.detail || "Google sign-in failed");
        }
      }}
      onError={() => onError?.("Google sign-in was cancelled or failed")}
      theme="outline"
      shape="pill"
      width="320"
    />
  );
}
