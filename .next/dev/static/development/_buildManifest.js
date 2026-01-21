self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/messages": [
    "static/chunks/pages/messages.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/checkout",
    "/dashboard",
    "/gigs/[id]",
    "/jobs",
    "/login/employer/[[...index]]",
    "/login/worker/[[...index]]",
    "/login/[[...index]]",
    "/messages",
    "/offer-service",
    "/payment-methods",
    "/profile/[id]",
    "/register/[[...index]]",
    "/subscription"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()