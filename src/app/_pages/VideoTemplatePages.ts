import { lazy } from "react";


export const VideoTemplatePages = {
    videoUpload: lazy(() => import("./videoUpload")),
    result: lazy(() => import("./result")),
}

export type VideoTemplatePageType = keyof typeof VideoTemplatePages;