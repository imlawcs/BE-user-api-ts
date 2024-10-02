const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isPasswordStrong = (password: string): boolean => {
    return password.length >= 6;
};

export {
    isEmailValid,
    isPasswordStrong
};
