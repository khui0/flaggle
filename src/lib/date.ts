export function minutesToString(minutes: number) {
  if (minutes >= 120) {
    const hours = (minutes / 60).toFixed(1);
    return hours + " hours";
  }
  return minutes + " " + (minutes === 1 ? "minute" : "minutes");
}
