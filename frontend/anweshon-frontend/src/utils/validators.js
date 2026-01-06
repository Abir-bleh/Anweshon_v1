export function isValidEmail(value) {
  if (!value) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
}

export function isValidBdPhone(value) {
  if (!value) return false;
  const re = /^01\d{9}$/; // 11 digits, starts with 01
  return re.test(value);
}

export function isValidStudentId(value) {
  if (!value) return false;
  const re = /^\d{7}$/;
  return re.test(value);
}

export function isValidPassword(value) {
  return typeof value === "string" && value.length >= 8;
}
