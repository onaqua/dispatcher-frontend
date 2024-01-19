import { Col, Row } from "antd";
import CarsPanel from "../components/CarsPanel";
import ClientsPanel from "../components/ClientsPanel";
import PreQueuePanel from "../components/PreQueuePanel";
import QueuePanel from "../components/QueuePanel";
import RecipesPanel from "../components/RecipesPanel";

export const HomePage: React.FC = () => {
    return (
        <div className="w-full h-full">
            <Row>
                <Col
                    xxl={8}
                    xs={24}
                    lg={12}
                    className=" p-2.5 space-y-3 h-full"
                >
                    <Row className="w-full h-full">
                        <ClientsPanel />
                    </Row>
                    <Row className="w-full h-full">
                        <CarsPanel />
                    </Row>
                    <Row className="w-full h-full">
                        <RecipesPanel />
                    </Row>
                </Col>

                <Col
                    xxl={16}
                    xs={24}
                    lg={12}
                    className=" p-2.5 space-y-3 h-full"
                >
                    <Row>
                        <PreQueuePanel />
                    </Row>
                    <Row className="w-full h-full">
                        <QueuePanel />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
