import Link from "next/link";

export default function NotVerifiedAlert() {
  return (
    <div className="grid">
      <div className="justify-self-center max-w-screen-md">
        <div role="alert" className="alert max-w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="#ff9b00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-bold text-lg">Unverified Account!</h3>
            <div className="text-sm">
              You must legally verify your account in the settings to use all
              features.
            </div>
          </div>
          <div>
            <Link
              href="/account/settings/personal-information"
              className="btn btn-sm bg-success hover:bg-accent text-black hover:drop-shadow-md"
            >
              Verify
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
