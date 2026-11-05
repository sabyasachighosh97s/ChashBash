
 // src/api/routes.ts

export const API_ROUTES = {
  // ==========================================
  // GET
  // ==========================================

  GET: {
    POSTS: '/api/v1/posts',

    USER_ME: '/api/v1/users/me',

    USER_BY_ID: (userId: string | number) =>
      `/api/v1/users/${userId}`,

    STATES: '/api/v1/locations/states',

    DISTRICTS: '/api/v1/locations/districts',

    SUBDIVISIONS: '/api/v1/locations/subdivisions',

    CROP_TYPES: '/api/v1/crop-master/crop-types',

    CROP_NAMES: '/api/v1/crop-master/crop-names',

    CROP_VARIETIES: '/api/v1/crop-master/crop-varieties',

    PROBLEM_HISTORY: '/history/user',

    PROBLEM_HISTORY_COMMENTS: (
      historyId: string | number,
    ) => `/treatment/${historyId}/comments`,

    NOMINATIM_REVERSE: '/reverse',

    PRODUCTS: '/api/v1/products',

    // Cart
    CART: '/api/v1/cart',
  },

  // ==========================================
  // POST
  // ==========================================

  POST: {
    REGISTER: '/api/v1/auth/register',

    LOGIN: '/api/v1/auth/login',

    CROPS: '/api/v1/crops',

    // Cart
    CART_ITEMS: '/api/v1/cart/items',
  },

  // ==========================================
  // PUT
  // ==========================================

  PUT: {
    // Cart item quantity update
    CART_ITEM: (cartItemId: string) =>
      `/api/v1/cart/items/${cartItemId}`,
  },

  // ==========================================
  // DELETE
  // ==========================================

  DELETE: {
    // Remove one cart item
    CART_ITEM: (cartItemId: string) =>
      `/api/v1/cart/items/${cartItemId}`,

    // Clear complete cart
    CART: '/api/v1/cart',
  },
};
