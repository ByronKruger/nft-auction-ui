import { Nft } from "../_models/nft.model";

export type ImageSendResult = "SUCCESS" | "ERORR";

export interface ImageSendResponse {
    result: ImageSendResult;
    data: Nft;
}