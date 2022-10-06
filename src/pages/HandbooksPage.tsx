import React from "react";
import { Button, Typography } from "antd";
import WorksModal from "../components/modals/handbooks/WorksModal";
import ReasonsModal from "../components/modals/handbooks/ReasonsModal";
import UserContext from "../helpers/UserContext";
import PostsModal from "../components/modals/handbooks/PostsModal";

const { Title } = Typography;

const HandbooksPage: React.FC = () => {
  const user = React.useContext(UserContext);
  const hasEdit: boolean = user ? user.edit_access : false;

  const [openWorksModal, setOpenWorksModal] = React.useState<boolean>(false);
  const [openReasonsModal, setOpenReasonsModal] = React.useState<boolean>(false);
  const [openPostsModal, setOpenPostsModal] = React.useState<boolean>(false);

  return (
    <>
      <>
        {openWorksModal && <WorksModal open={openWorksModal} onCancel={() => setOpenWorksModal(false)} />}
        {openReasonsModal && <ReasonsModal open={openReasonsModal} onCancel={() => setOpenReasonsModal(false)} />}
        {openPostsModal && <PostsModal open={openPostsModal} onCancel={() => setOpenPostsModal(false)} />}
      </>
      <>
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
            Список работ
          </Button>
        </div>
        <div>
          <Button
            className="handbook-button"
            type="primary"
            disabled={!hasEdit}
            onClick={() => setOpenReasonsModal(true)}
          >
            Список причин
          </Button>
        </div>
        <div>
          <Button
            className="handbook-button"
            type="primary"
            disabled={!hasEdit}
            onClick={() => setOpenPostsModal(true)}
          >
            Список постов
          </Button>
        </div>
      </>
    </>
  );
};

export default HandbooksPage;
