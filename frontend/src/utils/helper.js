
//Validation Function
export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required';
  const emailRegez = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegez.test(email)) return 'Please enter a valid email address'
  return '';
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";

  if (password.length < 8)
    return "Password must be at least 8 characters long";

  if (!/(?=.*[a-z])/.test(password))
    return "Password must contain at least one lowercase letter";

  if (!/(?=.*[A-Z])/.test(password))
    return "Password must contain at least one uppercase letter";

  if (!/(?=.*\d)/.test(password))
    return "Password must contain at least one number";

  if (!/(?=.*[@$!%*?&])/.test(password))
    return "Password must contain at least one special character (@$!%*?&)";

  return ""; // Valid password
};


export const validateAvatar = (file) => {
  if (!file) return ""; // Avatar is optional

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    return "Avatar must be a JPG or PNG file";
  }

  const maxSize = 5 * 1024 * 1024; // 5MB

  if (file.size > maxSize) {
    return "Avatar must be less than 5MB";
  }

  return ""; // Valid file
};


export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}