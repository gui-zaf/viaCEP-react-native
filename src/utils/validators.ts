export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/^(\d{5})(\d{3}).*/, "$1-$2");
};

export const validateCEP = (cep: string): boolean => {
  const regex = /^\d{5}-\d{3}$/;
  return regex.test(cep);
};

export const validateName = (name: string): boolean => {
  return name.trim().split(" ").length >= 2 && name.length >= 3;
};

export const validateStreet = (street: string): boolean => {
  return street.trim().length >= 3;
};

export const validateNumber = (number: string): boolean => {
  return /^\d+$/.test(number);
};

export const validateCity = (city: string): boolean => {
  return city.trim().length >= 2;
};

export const validateUF = (uf: string): boolean => {
  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];
  return ufs.includes(uf.toUpperCase());
};
