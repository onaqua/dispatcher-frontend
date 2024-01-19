import { Outlet } from "react-router-dom";

export const ConnectionLostLayout = (
    isConnectionLost: boolean,
    textMessage: string
) => {
    if (isConnectionLost) {
        return (
            <div className="w-full h-full pointer-events-none bg-slate-700">
                <div className=" absolute z-0">
                    <Outlet />
                </div>

                <div className=" absolute z-10">{textMessage}</div>
            </div>
        );
    }
};

export default ConnectionLostLayout;
