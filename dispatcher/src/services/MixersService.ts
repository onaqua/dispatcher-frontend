import { Mixer } from "../entities/Mixer";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";


export class MixersService
{
    public static GetAsync(): CancelablePromise<
        Array<Mixer>
    >
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/mixers`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
                503: `Production is not available`,
            },
        });
    }
}
