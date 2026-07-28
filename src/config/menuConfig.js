import { lazy } from "react";

const menuConfig = [
  {
    path: "/examination",
    component: lazy(() => import("../pages/dbatu/MarksDetailPage")),
  },
];

export default menuConfig;
