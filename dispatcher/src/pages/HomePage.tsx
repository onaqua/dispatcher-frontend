import { Card, Col, Grid, Row, Space } from "antd";
import ClientsPanel from "../components/ClientsPanel";
import CarsPanel from "../components/CarsPanel";
import RecipesPanel from "../components/RecipesPanel";
import PreQueuePanel from "../components/PreQueuePanel";
import QueuePanel from "../components/QueuePanel";
import { PermissionsService } from "../services/PermissionsService";
import { DispatcherPermissions } from "../consts/Permissions";

export const HomePage: React.FC = () => {
    return (
        <>
            <Row className=" h-full w-full">
                <Col xl={12} xs={24} className="space-y-2 p-2">
                    <Card className=" h-1/5">
                        <Space direction="vertical" className=" w-full">
                            {PermissionsService.hasPermission(
                                DispatcherPermissions.ClientsView
                            ) && <ClientsPanel />}

                            {PermissionsService.hasPermission(
                                DispatcherPermissions.CarsView
                            ) && <CarsPanel />}
                        </Space>
                    </Card>
                    <div className=" h-4/5">
                        {PermissionsService.hasPermission(
                            DispatcherPermissions.RecipesView
                        ) && <RecipesPanel />}
                    </div>
                </Col>

                <Col xl={12} xs={24} className=" space-y-2 p-2">
                    <div className=" h-1/2">
                        {PermissionsService.hasPermission(
                            DispatcherPermissions.ApplicationsInPreQueueView
                        ) && <PreQueuePanel />}
                    </div>

                    <div className=" h-1/2">
                        {PermissionsService.hasPermission(
                            DispatcherPermissions.ApplicationsInQueueView
                        ) && <QueuePanel />}
                    </div>
                </Col>
            </Row>
        </>
    );
};
