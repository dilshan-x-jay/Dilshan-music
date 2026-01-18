
import React from 'react';

// This utility component allows passing Tailwind classes to SVGs
const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    {props.children}
  </svg>
);

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3H14.5c-1.104 0-2 .896-2 2v10.3c-.453-.192-.958-.3-1.5-.3-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5V7h4v4c0 1.104.896 2 2 2h.5c1.104 0 2-.896 2-2V5c0-1.104-.896-2-2-2z" />
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></Icon>
);

export const GenreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 1.11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></Icon>
);

export const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h16.5M3.75 12h16.5m0 0v1.125c0 .621-.504 1.125-1.125 1.125H9.75l-1.03-1.03c-.23-.23-.51-.358-.81-.358H6a2.25 2.25 0 00-2.25 2.25v1.5M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" /></Icon>
);

export const LibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></Icon>
);

export const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></Icon>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
);

export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></Icon>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.196-.223 1.75 0 .554.223 1.02.684 1.11 1.226l.094.542c.065.383.311.717.668.91.356.193.754.246 1.13.159l.528-.126c.52-.124 1.053.166 1.356.67.302.505.242 1.124-.138 1.515l-.39.39a1.009 1.009 0 00-.115 1.423.974.974 0 001.423.115l.39-.39c.38-.38.912-.44 1.515-.138.504.303.794.836.67 1.356l-.126.528c-.087.376.034.774.23 1.13.192.356.48.602.855.668l.542.094c.542.09.993.56 1.226 1.11.223.554.223 1.196 0 1.75-.223.554-.684 1.02-1.226 1.11l-.542.094c-.383.065-.717.311-.91.668-.193.356-.246.754-.159 1.13l.126.528c.124.52-.166 1.053-.67 1.356-.505.302-1.124.242-1.515-.138l-.39-.39a1.009 1.009 0 00-1.423.115.974.974 0 00-.115 1.423l.39.39c.38.38.44.912.138 1.515-.303.504-.836.794-1.356.67l-.528-.126c-.376-.087-.774.034-1.13-.23-.356.192-.602.48-.668-.855l-.094.542c-.09.542-.56.993-1.11 1.226-.554-.223-1.196-.223-1.75 0-.554-.223-1.02-.684-1.11-1.226l-.094-.542c-.065-.383-.311-.717-.668-.91-.356-.193-.754-.246-1.13-.159l-.528.126c-.52.124-1.053-.166-1.356-.67-.302-.505-.242-1.124.138-1.515l.39-.39a1.009 1.009 0 00.115-1.423.974.974 0 00-1.423-.115l-.39.39c-.38.38-.912.44-1.515.138-.504-.303-.794-.836-.67-1.356l.126-.528c.087-.376-.034-.774-.23-1.13a.974.974 0 01-.855-.668l-.542-.094c-.542-.09-.993-.56-1.226-1.11a2.002 2.002 0 010-1.75c.233-.55.684-1.02 1.226-1.11l.542-.094c.383-.065.717-.311.91-.668a.974.974 0 01.159-1.13l-.126-.528c-.124-.52.166-1.053.67-1.356.505-.302 1.124-.242 1.515.138l.39.39a1.009 1.009 0 001.423-.115.974.974 0 00.115-1.423l-.39-.39c-.38-.38-.44-.912-.138-1.515.303-.504.836-.794 1.356-.67l.528.126c.376.087.774-.034 1.13-.23.356-.192.602-.48.668-.855l.094-.542z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} strokeWidth={0} fill="currentColor"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></Icon>
);

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} strokeWidth={0} fill="currentColor"><path d="M6.75 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75h-3zM14.25 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75h-3z" /></Icon>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></Icon>
);

export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
);

export const HeartFilledIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} fill="currentColor" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
);

export const NextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} fill="currentColor"><path d="M5.25 5.25a3 3 0 00-3 3v4.5a3 3 0 003 3h4.5a3 3 0 003-3v-4.5a3 3 0 00-3-3H5.25z" transform="M15 5.25v13.5l9-6.75-9-6.75z" /></Icon>
);

export const PrevIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} fill="currentColor"><path d="M18.75 5.25a3 3 0 013 3v4.5a3 3 0 01-3 3h-4.5a3 3 0 01-3-3v-4.5a3 3 0 013-3h4.5z" transform="M9 5.25L0 12l9 6.75V5.25z" /></Icon>
);

export const VolumeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
);

export const ShuffleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 010 2.25H5.625a1.125 1.125 0 010-2.25z" /></Icon>
);

export const RepeatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667 0l3.181-3.183a8.25 8.25 0 00-11.667 0l-3.181 3.183" /></Icon>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></Icon>
);

export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
);

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></Icon>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon>
);

export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></Icon>
);

export const MaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></Icon>
);

export const FemaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" transform="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></Icon>
);
