// utils/date.ts
import { PhotoPeriod } from '../photo/entities/photo.entity';

// export function getTodayDate(): string {
//   return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
// }

// export function getCurrentPeriod(): PhotoPeriod {
//   const hour = new Date().getHours();
//   return hour < 12 ? PhotoPeriod.MORNING : PhotoPeriod.AFTERNOON;
// }

//fake date
export function getTodayDate(): string {
  return '2025-04-03';
}

export function getCurrentPeriod(): PhotoPeriod {
  return PhotoPeriod.MORNING;
}
