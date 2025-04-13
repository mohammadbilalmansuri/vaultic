const formatBalance = (balance: string): string => {
  const [whole, decimal] = balance.split(".");
  if (!decimal || /^0+$/.test(decimal)) return whole;
  return balance;
};

export default formatBalance;
