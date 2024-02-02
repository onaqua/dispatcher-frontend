import { ProductionApplicationDTO } from "../entities/ApplicationDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import { AddApplicationInPreQueueRequest } from "./requests/LoginRequest";


export class ApplicationsService
{
    public static GetAllInQueueAsync(): CancelablePromise<
        Array<ProductionApplicationDTO>
    >
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static AddInQueueAsync(
        applicationId: number
    ): CancelablePromise<Array<ProductionApplicationDTO>>
    {
        return __request(OpenAPI, {
            method: "POST",
            url: `/applications/inQueue/${ applicationId }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static AddInPreQueueAsync(
        request: AddApplicationInPreQueueRequest
    ): CancelablePromise<void>
    {
        return __request(OpenAPI, {
            method: "POST",
            body: request,
            url: `/applications/inPreQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteInQueueAsync(
        applicationId: number
    ): CancelablePromise<void>
    {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/applications/inQueue/${ applicationId }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static DeleteInPreQueueAsync(
        applicationId: number
    ): CancelablePromise<void>
    {
        return __request(OpenAPI, {
            method: "DELETE",
            url: `/applications/inPreQueue/${ applicationId }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetAllInPreQueueAsync(): CancelablePromise<
        Array<ProductionApplicationDTO>
    >
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inPreQueue`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetInQueueAsync(
        applicationId: number
    ): CancelablePromise<ProductionApplicationDTO>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inQueue/${ applicationId }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
                503: `Service unavailable`,
            },
        });
    }

    public static GetInPreQueueAsync(
        applicationId: number
    ): CancelablePromise<ProductionApplicationDTO>
    {
        return __request(OpenAPI, {
            method: "GET",
            url: `/applications/inPreQueue/${ applicationId }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
                503: `Service unavailable`,
            },
        });
    }
}
