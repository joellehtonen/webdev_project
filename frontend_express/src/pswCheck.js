const PasswordChecks = (password) => {
  const commonPasswords = [
    "password",
    "123456",
    "123456789",
    "12345678",
    "12345",
    "1234567",
    "qwerty",
  ];

  const isPasswordCommon = (password) =>
    commonPasswords.includes(password.toLowerCase());

  if (isPasswordCommon(password)) {
    return {
      isValid: false,
      error: "Password is too common. Please choose a different password.",
    };
  }

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 6;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*-_+=]/.test(password);
    const commonPasswordCriteria = !isPasswordCommon(password);

    return (
      lengthCriteria &&
      uppercaseCriteria &&
      lowercaseCriteria &&
      numberCriteria &&
      specialCharCriteria &&
      commonPasswordCriteria
    );
  };

  if (!checkPasswordStrength(password)) {
    return {
      isValid: false,
      error:
        "Password must be at least 6 characters long, contain uppercase and lowercase letters, a number, and a special character.",
    };
  }

  return { isValid: true };
};

export default PasswordChecks;
