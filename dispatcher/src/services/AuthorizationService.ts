import { Dayjs } from "dayjs";
import { PagedList } from "../entities/PagedList";
import UserState from "../entities/UserStateDTO";
import { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import { LoginRequest } from "./requests/LoginRequest";
import { EventStatus } from "../entities/EventStatus";
import { EventLevel } from "../entities/EventLevel";

export class EventsService {
    public static GetAsync(
        offset: number = 0,
        quantity: number = 5,
        objectName?: string | undefined,
        userName?: string | undefined,
        dateFrom?: Dayjs | undefined | null,
        dateTo?: Dayjs | undefined | null,
        status?: EventStatus | undefined | null,
        level?: EventLevel | undefined | null
    ): CancelablePromise<PagedList<Event>> {
        return __request(OpenAPI, {
            method: "GET",
            url: `/events?offset=${offset}&quantity=${quantity}&fromDate=${dateFrom?.toJSON()}&toDate=${dateTo?.toJSON()}&objectName=${
                objectName ?? ""
            }&userName=${userName ?? ""}&status=${status ?? ""}&level=${
                level ?? ""
            }`,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}

export class AuthorizationService {
    public static SignInAsync(body: LoginRequest): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/authorization/signin",
            body: body,
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static SignOutAsync(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/authorization/signOut",
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static GetStateAsync(): CancelablePromise<UserState> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/authorization/state",
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }

    public static RefreshAsync(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/authorization/refresh",
            errors: {
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
}
