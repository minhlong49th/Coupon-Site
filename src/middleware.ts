// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// const isAdminRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/coupons(.*)",
//   "/brands(.*)",
//   "/moderation(.*)",
//   "/analytics(.*)",
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isAdminRoute(req)) auth().protect();
// });

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
