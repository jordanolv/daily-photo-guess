// utils/date.ts

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

//fake date
// export function getTodayDate(): string {
//   return '2025-04-03';
// }

