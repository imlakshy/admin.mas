export default function ToggleStorageIcon({
  size = 24,
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      {/* Base */}
      <rect
        x="6"
        y="28"
        width="36"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="4"
      />

      {/* Left connector */}
      <path
        d="M20 7H10C7.79086 7 6 8.79086 6 11V17C6 19.2091 7.79086 21 10 21H20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Main circle */}
      <circle
        cx="34"
        cy="14"
        r="8"
        fill="#2F88FF"
        stroke="currentColor"
        strokeWidth="4"
      />

      {/* Inner dot */}
      <circle
        cx="34"
        cy="14"
        r="3"
        fill="white"
      />
    </svg>
  );
}
