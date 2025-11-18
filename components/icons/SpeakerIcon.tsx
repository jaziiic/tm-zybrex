
import React from 'react';

export const SpeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M11.583 3.692a.75.75 0 0 1 .834 0l9 6a.75.75 0 0 1 0 1.216l-9 6a.75.75 0 0 1-.834 0l-9-6a.75.75 0 0 1 0-1.216l9-6ZM12 5.581 4.312 10.5 12 15.419 19.688 10.5 12 5.581Z"
      clipRule="evenodd"
    />
    <path d="M11.25 18.375a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-1.5 0v4.5Z" />
    <path d="M2.25 10.5a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
    <path d="M18.75 10.5a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
  </svg>
);
