import { Button } from "@/components/ui/button";
import { startGoogleSignInAction } from "@/lib/actions/auth";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.6 12 2.6 6.8 2.6 2.6 6.9 2.6 12s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12Z"
      />
      <path
        fill="#34A853"
        d="M2.6 7.1 5.8 9.4C6.7 7 9.1 5.2 12 5.2c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.6 12 2.6 8.4 2.6 5.2 4.7 3.6 7.8l-1 .7Z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.4c2.4 0 4.5-.8 6-2.3l-2.8-2.3c-.8.6-1.8 1.1-3.2 1.1-3.8 0-5.1-2.6-5.4-3.9l-3.3 2.5c1.6 3.2 4.9 4.9 8.7 4.9Z"
      />
      <path
        fill="#4285F4"
        d="M21 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.3-1.1 2.3-2.2 3l2.8 2.3c1.7-1.5 3-3.9 3-7.6Z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  label,
  next = "/dashboard"
}: {
  label: string;
  next?: string;
}) {
  return (
    <form action={startGoogleSignInAction}>
      <input type="hidden" name="next" value={next} />
      <Button type="submit" variant="secondary" className="w-full gap-2">
        <GoogleIcon />
        {label}
      </Button>
    </form>
  );
}
