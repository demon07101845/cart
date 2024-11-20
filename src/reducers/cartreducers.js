// Action types as constants
const ADD_ITEM = 'ADD_ITEM';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';

export function cartReducer(cart, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const itemInCart = cart.find((item) => item.id === action.item.id);
      if (itemInCart) {
        return cart.map((item) =>
          item.id === action.item.id
            ? { ...item, cartQuantity: item.cartQuantity + action.quantity }
            : item
        );
      } else {
        return [...cart, { ...action.item, cartQuantity: action.quantity }];
      }
    }
    case INCREMENT_ITEM: {
      return cart.map((item) =>
        item.id === action.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
    }
    case DECREMENT_ITEM: {
      return cart
        .map((item) =>
          item.id === action.id && item.cartQuantity > 1
            ? { ...item, cartQuantity: item.cartQuantity - 1 }
            : item
        )
        .filter((item) => item.cartQuantity > 0);
    }
    case REMOVE_ITEM: {
      return cart.filter((item) => item.id !== action.id);
    }
    default:
      return cart;
  }
}

// // Action creators for better dispatch handling
// export const addItemToCart = (item, quantity) => ({
//   type: ADD_ITEM,
//   item,
//   quantity,
// });

// export const incrementItem = (id) => ({
//   type: INCREMENT_ITEM,
//   id,
// });

// export const decrementItem = (id) => ({
//   type: DECREMENT_ITEM,
//   id,
// });

// export const removeItem = (id) => ({
//   type: REMOVE_ITEM,
//   id,
// });
