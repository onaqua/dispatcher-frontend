import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";


export class ConnectionsService
{
    public static CheckAsync(): CancelablePromise<void>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/connections/check`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
