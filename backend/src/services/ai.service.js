function generateOrderExplanation(order) {
  if (!order || !order.status) return null;

  switch (order.status) {
    case "pending":
      return `
• Your order has been placed successfully.
• The restaurant has received your request.
• They will accept it shortly.
`;

    case "accepted":
      return `
• The restaurant has accepted your order.
• Ingredients are being prepared.
• Cooking will start soon.
`;

    case "preparing":
      return `
• Your food is currently being prepared.
• The kitchen is actively cooking your order.
• It will be completed shortly.
`;

    case "completed":
      return `
• Your order has been completed.
• The food is ready for pickup or delivery.
• Enjoy your meal.
`;

    default:
      return null;
  }
}

module.exports = { generateOrderExplanation };
