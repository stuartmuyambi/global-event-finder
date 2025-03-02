// Sound configurations for UI interactions
export const SOUNDS = {
  hover: '/sounds/hover.mp3',
  click: '/sounds/click.mp3',
  notification: '/sounds/notification.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3'
} as const;

// Volume configurations
export const VOLUMES = {
  interaction: 0.2,
  notification: 0.4,
  alert: 0.6
} as const;

// Enable/disable sound based on user preference
export const getSoundPreference = (): boolean => {
  return localStorage.getItem('soundEnabled') !== 'false';
};

export const setSoundPreference = (enabled: boolean): void => {
  localStorage.setItem('soundEnabled', String(enabled));
};