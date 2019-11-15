const getShippingCost = (subTotal, isDirectSelected) => {
  if (isDirectSelected) {
    if (subTotal < 30000) {
      return 599;
    } else {
      return 999;
    }
  } else {
    if (subTotal < 30000) {
      return 999;
    } else if (subTotal < 80000) {
      return 1999;
    } else {
      return 2999;
    }
  }
};

module.exports = getShippingCost;
