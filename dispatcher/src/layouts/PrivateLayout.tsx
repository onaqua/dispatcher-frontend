import { Col, Layout, Row } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { UserAccountDropdownMenu } from "../components/UserAccount";
import { SocketLayout } from "./SocketLayout";

export type PrivateLayoutProps = {
    element: React.ReactNode;
};

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ element }) => {
    return (
        <Layout className=" w-full h-full bg-slate-50">
            <Header className=" bg-white">
                <Row>
                    <Col xs={0} xl={22}></Col>
                    <Col xs={24} xl={2} className="p-4">
                        <div className="cursor-pointer">
                            <UserAccountDropdownMenu username="test" />
                        </div>
                    </Col>
                </Row>
            </Header>

            <Content className=" w-full h-full">
                <SocketLayout element={element} />
            </Content>
        </Layout>
    );
};
