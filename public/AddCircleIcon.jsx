export default function AddCircleIcon({
  size = 24,
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      {/* Background circle */}
      <path
        d="M512 512m-448 0a448 448 0 1 0 896 0a448 448 0 1 0-896 0Z"
        fill="#4CAF50"
      />

      {/* Vertical bar */}
      <path
        d="M448 298.666667h128v426.666666h-128z"
        fill="white"
      />

      {/* Horizontal bar */}
      <path
        d="M298.666667 448h426.666666v128H298.666667z"
        fill="white"
      />
    </svg>
  );
}
