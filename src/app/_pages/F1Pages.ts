import { lazy } from "react";


export const F1Page = {
    landing: lazy(() => import("./landing")),
    camera: lazy(() => import("./camera")),
    informationForm: lazy(() => import("./informationForm")),
    submitted: lazy(() => import("./submitted")),
}

export type F1Pages = keyof typeof F1Page;