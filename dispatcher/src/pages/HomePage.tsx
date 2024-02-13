import { Col, Row } from "antd";
import CarsPanel from "../components/CarsPanel";
import ClientsPanel from "../components/ClientsPanel";
import PreQueuePanel from "../components/PreQueuePanel";
import QueuePanel from "../components/QueuePanel";
import RecipesPanel from "../components/RecipesPanel";

export const HomePage: React.FC = () => {
    return (
        <>
            <Row className="p-2 w-full" gutter={[14, 4]}>
                <Col xxl={12} md={24}>
                    <Row
                        className="h-full w-full space-y-11"
                        justify={"space-evenly"}
                    >
                        <Col xxl={24} md={24} className=" w-full" order={1}>
                            <ClientsPanel />
                        </Col>
                        <Col xxl={24} md={24} className=" w-full" order={2}>
                            <CarsPanel />
                        </Col>
                    </Row>
                </Col>

                <Col xxl={12} md={24} className=" w-full">
                    <PreQueuePanel />
                </Col>

                <Col xxl={12} md={24} className=" w-full" order={2}>
                    <RecipesPanel />
                </Col>

                <Col xxl={12} md={24} className=" w-full" order={4}>
                    <QueuePanel />
                </Col>
            </Row>
        </>
    );
};
