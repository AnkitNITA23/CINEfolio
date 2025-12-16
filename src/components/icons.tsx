import type { SVGProps } from 'react';

export const CineFolioLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <g fill="currentColor">
      <path d="M48,48V208a8,8,0,0,0,16,0V48a8,8,0,0,0-16,0Z" />
      <path d="M208,48V208a8,8,0,0,0,16,0V48a8,8,0,0,0-16,0Z" />
      <path
        d="M192,48H80V208H192V48Zm-16,144H96V64H176V192Z"
        opacity="0.5"
      />
    </g>
  </svg>
);

export const TmdbIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    {...props}
  >
    <rect width="512" height="512" fill="#0d253f" rx="15%"></rect>
    <path
      fill="#01d277"
      d="M256 322.6a130.4 130.4 0 0 1-92.2-38.2 129.2 129.2 0 0 1-38.2-92.2 129.2 129.2 0 0 1 38.2-92.2 129.2 129.2 0 0 1 92.2-38.2 129.2 129.2 0 0 1 92.2 38.2 129.2 129.2 0 0 1 38.2 92.2 129.2 129g.2 0 0 1-38.2 92.2 130.4 130.4 0 0 1-92.2 38.2z"
    ></path>
    <path
      fill="#00b4e4"
      d="M256 322.6a130.4 130.4 0 0 1-92.2-38.2 129.2 129.2 0 0 1-38.2-92.2v-21.8a129.2 129.2 0 0 1 38.2-92.2 129.2 129.2 0 0 1 92.2-38.2h21.8a129.2 129.2 0 0 1 92.2 38.2 129.2 129.2 0 0 1 38.2 92.2v21.8a129.2 129.2 0 0 1-38.2 92.2 130.4 130.4 0 0 1-92.2 38.2z"
    ></path>
  </svg>
);

export const ImdbIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    {...props}
  >
    <rect width="48" height="48" fill="#f5c518" rx="4"></rect>
    <path
      fill="#000"
      d="M22.2 16.7h4.4v14h-4.4v-14zm-11 0h4.4v14h-4.4v-14zm21.4 7c0-4.1 2-6.4 5-6.4s5 2.3 5 6.4c0 4.1-2 6.4-5 6.4s-5-2.3-5-6.4zm6.1 0c0-1.8-.6-3.1-2-3.1s-2.1 1.3-2.1 3.1c0 1.8.7 3.1 2.1 3.1s2-.9 2-3.1z"
    ></path>
  </svg>
);

export const RottenTomatoesIcon = (props: SVGProps<SVGSVGElement>) => {
  // This is a simplified version of the Rotten Tomatoes icon.
  // The official logo is complex and has multiple variants.
  // This version captures the essence of the "fresh" tomato.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          fill="#F03"
          stroke="#C00"
          d="M24 38c-7.73 0-14-6.27-14-14S16.27 10 24 10s14 6.27 14 14-6.27 14-14 14z"
        />
        <path
          fill="#9C0"
          stroke="#690"
          d="M29 11c-3 1-5 1-5 1s-4-2-7-1c-2 2-2 6-2 6s3 1 5 0c2 2 6 2 6 2s4-1 6-3c-1-3-3-5-3-5z"
        />
        <path
          fill="#FFF"
          fillOpacity=".3"
          d="M34 20a10 10 0 0 0-10-10a10.2 10.2 0 0 0-2 .2a12 12 0 0 1 12 12a11.7 11.7 0 0 0-.2-2z"
        />
      </g>
    </svg>
  );
};


export const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

export const AppleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
    >
        <path d="M12.01,16.03c-1.3,0-2.45-0.42-3.45-1.25c-1-0.84-1.7-1.95-1.95-3.32h10.79c-0.01,0.01-0.01,0.02-0.02,0.03 c-0.19,1.4-0.91,2.53-1.92,3.34C14.44,15.62,13.26,16.03,12.01,16.03z" />
        <path d="M19.34,10.59c-0.31-0.12-0.64-0.18-0.98-0.18c-1.2,0-2.22,0.53-2.89,1.58c-0.65-1.04-1.69-1.58-2.89-1.58 c-0.34,0-0.67,0.06-0.98,0.18C8.94,10.2,8.02,9.15,8.02,7.85c0-1.07,0.52-1.99,1.38-2.58C10.23,4.68,11.08,4.3,12,4.3 c0.92,0,1.77,0.38,2.6,0.97c0.86,0.6,1.38,1.51,1.38,2.58C15.98,9.15,15.06,10.2,14.39,10.59 M19.34,10.59L19.34,10.59z" />
        <path d="M22.75,12c0-5.94-4.81-10.75-10.75-10.75S1.25,6.06,1.25,12S6.06,22.75,12,22.75S22.75,17.94,22.75,12z M12,21.25 c-5.1,0-9.25-4.15-9.25-9.25S6.9,2.75,12,2.75s9.25,4.15,9.25,9.25S17.1,21.25,12,21.25z" />
    </svg>
);
