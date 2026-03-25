import React from 'react';

interface AuraWrapperProps {
  children: React.ReactNode;
  honestyScore: string;
  isBot?: boolean;
  className?: string;
}

export function AuraWrapper({ children, honestyScore, isBot, className = "" }: AuraWrapperProps) {
  let auraClass = "";

  if (isBot || honestyScore === '🤖') {
    auraClass = "aura-bot";
  } else if (honestyScore === '😇') {
    auraClass = "aura-halo";
  } else if (honestyScore === '🤥') {
    auraClass = "aura-glitch";
  }

  return (
    <span className={`${auraClass} ${className} inline-block transition-all duration-300 font-bold`}>
      {children}
    </span>
  );
}
