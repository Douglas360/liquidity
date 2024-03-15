export const shortenAddress = (address) => {
  return `${address.substring(0, 6)}...${address.slice(address.length - 4)}`;
};

export const parseErrorMsg = (e) => {
  const jsonError = JSON.parse(JSON.stringify(e));
  return jsonError?.reason || jsonError?.error?.message;
};
