import React from "react";
import { Button, Typography } from "antd";
import WorksModal from "../components/modals/handbooks/WorksModal";
import ReasonsModal from "../components/modals/handbooks/ReasonsModal";
import UserContext from "../helpers/UserContext";
import PostsModal from "../components/modals/handbooks/PostsModal";
import MaterialsModal from "../components/modals/handbooks/MaterialsModal";
import WarehousesModal from "../components/modals/handbooks/WarehousesModal";
import CarsModal from "../components/modals/handbooks/CarsModal";
import EmployeesModal from "../components/modals/handbooks/EmployeesModal";

const { Title } = Typography;

const HandbooksPage: React.FC = () => {
  const user = React.useContext(UserContext);
  const hasEdit: boolean = user ? user.edit_access : false;

  const [openWorksModal, setOpenWorksModal] = React.useState<boolean>(false);
  const [openReasonsModal, setOpenReasonsModal] = React.useState<boolean>(false);
  const [openPostsModal, setOpenPostsModal] = React.useState<boolean>(false);
  const [openMaterialsModal, setOpenMaterialsModal] = React.useState<boolean>(false);
  const [openWarehousesModal, setOpenWarehousesModal] = React.useState<boolean>(false);
  const [openCarsModal, setOpenCarsModal] = React.useState<boolean>(false);
  const [openEmployeesModal, setOpenEmployeesModal] = React.useState<boolean>(false);

  return (
    <>
      <>
        {openWorksModal && <WorksModal open={openWorksModal} onCancel={() => setOpenWorksModal(false)} />}
        {openReasonsModal && <ReasonsModal open={openReasonsModal} onCancel={() => setOpenReasonsModal(false)} />}
        {openPostsModal && <PostsModal open={openPostsModal} onCancel={() => setOpenPostsModal(false)} />}
        {openMaterialsModal && (
          <MaterialsModal open={openMaterialsModal} onCancel={() => setOpenMaterialsModal(false)} />
        )}
        {openWarehousesModal && (
          <WarehousesModal open={openWarehousesModal} onCancel={() => setOpenWarehousesModal(false)} />
        )}
        {openCarsModal && <CarsModal open={openCarsModal} onCancel={() => setOpenCarsModal(false)} />}
        {openEmployeesModal && (
          <EmployeesModal open={openEmployeesModal} onCancel={() => setOpenEmployeesModal(false)} />
        )}
      </>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <Title className={"ml-10 mt-10 mb-5"} level={3}>
            Общее
          </Title>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenCarsModal(true)}
            >
              Транспортные средства
            </Button>
          </div>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenEmployeesModal(true)}
            >
              Работники
            </Button>
          </div>
        </div>

        <div style={{ marginLeft: "90px" }}>
          <Title className={"ml-10 mt-10 mb-5"} level={3}>
            Заказ-наряд
          </Title>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenWorksModal(true)}
            >
              Работы
            </Button>
          </div>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenReasonsModal(true)}
            >
              Причины
            </Button>
          </div>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenPostsModal(true)}
            >
              Посты
            </Button>
          </div>
        </div>

        <div style={{ marginLeft: "90px" }}>
          <Title className={"ml-10 mt-10 mb-5"} level={3}>
            Склад
          </Title>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenMaterialsModal(true)}
            >
              Материалы
            </Button>
          </div>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenWarehousesModal(true)}
            >
              Склады
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandbooksPage;
