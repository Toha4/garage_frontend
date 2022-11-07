import React from "react";
import { Button, Typography } from "antd";
import WorksModal from "../components/modals/handbooks/WorksModal";
import ReasonsModal from "../components/modals/handbooks/ReasonsModal";
import UserContext from "../helpers/UserContext";
import PostsModal from "../components/modals/handbooks/PostsModal";
import MaterialModal from "../components/modals/handbooks/MaterialsModal";
import WarehouseModal from "../components/modals/handbooks/WarehouseModal";

const { Title } = Typography;

const HandbooksPage: React.FC = () => {
  const user = React.useContext(UserContext);
  const hasEdit: boolean = user ? user.edit_access : false;

  const [openWorksModal, setOpenWorksModal] = React.useState<boolean>(false);
  const [openReasonsModal, setOpenReasonsModal] = React.useState<boolean>(false);
  const [openPostsModal, setOpenPostsModal] = React.useState<boolean>(false);
  const [openMaterialModal, setOpenMaterialModal] = React.useState<boolean>(false);
  const [openWarehouseModal, setOpenWarehouseModal] = React.useState<boolean>(false);

  return (
    <>
      <>
        {openWorksModal && <WorksModal open={openWorksModal} onCancel={() => setOpenWorksModal(false)} />}
        {openReasonsModal && <ReasonsModal open={openReasonsModal} onCancel={() => setOpenReasonsModal(false)} />}
        {openPostsModal && <PostsModal open={openPostsModal} onCancel={() => setOpenPostsModal(false)} />}
        {openMaterialModal && <MaterialModal open={openMaterialModal} onCancel={() => setOpenMaterialModal(false)} />}
        {openWarehouseModal && (
          <WarehouseModal open={openWarehouseModal} onCancel={() => setOpenWarehouseModal(false)} />
        )}
      </>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
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
              onClick={() => setOpenMaterialModal(true)}
            >
              Материалы
            </Button>
          </div>
          <div>
            <Button
              className="handbook-button"
              type="primary"
              disabled={!hasEdit}
              onClick={() => setOpenWarehouseModal(true)}
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
