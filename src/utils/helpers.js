
export const formateCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
    }).format(amount);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
};