import User from "../model/userModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    const userData = await User.findById(req.userId);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const cartData = userData.cartData || {};

    // cartData = { productId: quantity }
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await User.findByIdAndUpdate(req.userId, { cartData }, { new: true });

    return res.status(201).json({ message: "Added to cart" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "addToCart error" });
  }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const userData = await User.findById(req.userId);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const cartData = userData.cartData || {};

    cartData[itemId] = Number(quantity); // overwrite quantity

    await User.findByIdAndUpdate(req.userId, { cartData }, { new: true });

    return res.status(200).json({ message: "Cart updated" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "updateCart error" });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) return res.status(404).json({ message: "User not found" });

    // returns: { productId: quantity }
    return res.status(200).json(userData.cartData || {});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "getUserCart error" });
  }
};
