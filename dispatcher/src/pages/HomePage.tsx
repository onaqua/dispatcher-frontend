import { Col, Row } from "antd";
import CarsPanel from "../components/CarsPanel";
import ClientsPanel from "../components/ClientsPanel";
import PreQueuePanel from "../components/PreQueuePanel";
import QueuePanel from "../components/QueuePanel";
import RecipesPanel from "../components/RecipesPanel";
import { Permission } from "../components/Permission";
import { DispatcherPermissions } from "../consts/Permissions";

export const HomePage: React.FC = () => {
    return (
        <Row className="p-8 h-screen">
            <Col
                xxl={12}
                xl={12}
                xs={24}
                md={24}
                className="items-center justify-center h-full bg-yellow"
            >
                <Row gutter={[24, 24]} className=" w-full h-1/6">
                    <Permission need={DispatcherPermissions.ClientsView}>
                        <Col
                            xxl={12}
                            xl={24}
                            xs={24}
                            md={24}
                            className=" w-full"
                        >
                            <ClientsPanel />
                        </Col>
                    </Permission>

                    <Permission need={DispatcherPermissions.CarsView}>
                        <Col xxl={12} xl={24} xs={24} md={24}>
                            <CarsPanel />
                        </Col>
                    </Permission>

                    <Permission need={DispatcherPermissions.RecipesView}>
                        <Col span={24}>
                            <RecipesPanel />
                        </Col>
                    </Permission>
                </Row>
            </Col>

            <Col xxl={12} xl={12} xs={24} md={24} className="flex">
                <Row gutter={[24, 32]} className="w-full h-fit">
                    <Permission
                        need={
                            DispatcherPermissions.ApplicationsInPreQueueView
                        }
                    >
                        <Col xxl={24} xl={24} xs={24} md={24}>
                            <PreQueuePanel />
                        </Col>
                    </Permission>

                    <Permission
                        need={
                            DispatcherPermissions.ApplicationsInQueueView
                        }
                    >
                        <Col xxl={24} xl={24} xs={24} md={24}>
                            <QueuePanel />
                        </Col>
                    </Permission>
                </Row>
            </Col>
        </Row>
    );
};
