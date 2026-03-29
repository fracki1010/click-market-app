import { getLikelyPreloadLimit } from "@/utils/networkPrefetch";

type Loader = () => Promise<unknown>;

type WarmupJob = {
  key: string;
  loader: Loader;
};

const preloaded = new Set<string>();

const jobs: Record<string, WarmupJob> = {
  home: {
    key: "home",
    loader: () => import("../features/Home/views/HomePage"),
  },
  products: {
    key: "products",
    loader: () => import("../features/Products/views/ProductsPage"),
  },
  productDetail: {
    key: "product-detail",
    loader: () => import("../features/Products/views/ProductDetailPage"),
  },
  categories: {
    key: "categories",
    loader: () => import("../features/Categories/views/CategoriesPage"),
  },
  cart: {
    key: "cart",
    loader: () => import("../features/Cart/views/CartPage"),
  },
  checkout: {
    key: "checkout",
    loader: () => import("../features/Order/view/CheckoutPage"),
  },
  orderSuccess: {
    key: "order-success",
    loader: () => import("../features/Order/view/OrderSuccessPage"),
  },
  orderList: {
    key: "orders",
    loader: () => import("../features/Order/view/OrderPage"),
  },
  login: {
    key: "login",
    loader: () => import("../features/Auth/views/LoginPage"),
  },
  register: {
    key: "register",
    loader: () => import("../features/Auth/views/RegisterPage"),
  },
  profile: {
    key: "profile",
    loader: () => import("../features/Auth/views/ProfilePage"),
  },
};

const runOnce = (job: WarmupJob) => {
  if (preloaded.has(job.key)) return;
  preloaded.add(job.key);
  void job.loader().catch(() => {
    preloaded.delete(job.key);
  });
};

const normalizePath = (to: string) => {
  const [path] = to.split("?");

  return path || "/";
};

const getDirectJobs = (path: string): WarmupJob[] => {
  if (path.startsWith("/products/")) return [jobs.productDetail];
  if (path.startsWith("/products")) return [jobs.products];
  if (path.startsWith("/categories")) return [jobs.categories];
  if (path.startsWith("/cart")) return [jobs.cart];
  if (path.startsWith("/checkout/success")) return [jobs.orderSuccess];
  if (path.startsWith("/checkout")) return [jobs.checkout];
  if (path.startsWith("/my-orders")) return [jobs.orderList];
  if (path.startsWith("/login")) return [jobs.login];
  if (path.startsWith("/register")) return [jobs.register];
  if (path.startsWith("/profile")) return [jobs.profile];
  if (path === "/" || path.startsWith("/home")) return [jobs.home];

  return [];
};

const getLikelyNextJobs = (path: string): WarmupJob[] => {
  if (path === "/" || path.startsWith("/home")) {
    return [jobs.products, jobs.categories, jobs.cart];
  }
  if (path.startsWith("/products")) return [jobs.cart, jobs.home];
  if (path.startsWith("/categories")) return [jobs.products, jobs.home];
  if (path.startsWith("/cart")) return [jobs.checkout, jobs.products];
  if (path.startsWith("/checkout")) return [jobs.orderSuccess, jobs.orderList];
  if (path.startsWith("/login")) return [jobs.register, jobs.home];

  return [];
};

export const warmupRouteOnIntent = (to: string) => {
  const path = normalizePath(to);
  const direct = getDirectJobs(path);
  const likely = getLikelyNextJobs(path);
  const likelyLimit = getLikelyPreloadLimit();

  [...direct, ...likely.slice(0, likelyLimit)].forEach(runOnce);
};
