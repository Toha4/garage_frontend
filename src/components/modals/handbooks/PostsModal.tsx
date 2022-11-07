import React from "react";
import { Button, Modal, Space, Table } from "antd";
import { PostType } from "../../../services/types";
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PostService from "../../../services/PostService";
import PostModalForm from "../../forms/PostModalForm";
import showConfirmDialog from "../../common/ConfirmDialog";

interface IPostsModal {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}

const PostsModal: React.FC<IPostsModal> = ({ open, onOk, onCancel }) => {
  const DataPostService = new PostService();

  const [dataSource, setDataSource] = React.useState<PostType[]>([]);
  const [updateData, setUpdateData] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editPk, setEditPk] = React.useState<number | null>(null);
  const [modalFormOpen, setModalFormOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (result: PostType[]) => {
      setDataSource(result);
    };

    const onError = () => {
      setDataSource([]);
    };

    const onFinally = () => {
      setUpdateData(false);
      setLoading(false);
    };

    if (updateData) {
      setUpdateData(true);
      DataPostService.getPosts().then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [updateData]);

  const showFormModal = () => {
    setModalFormOpen((prevModalFormOpen) => !prevModalFormOpen);
  };

  const handleAddPost = () => {
    setEditPk(null);
    showFormModal();
  };

  const handleEditPost = (pk: number | undefined) => {
    setEditPk(pk || null);
    showFormModal();
  };

  const handleDeletePost = (pk: number | undefined) => {
    const name = dataSource.find((item) => pk === item.pk)?.name;

    showConfirmDialog({
      title: `Вы уверены, что хотите удалить пост "${name}"?`,
      onOk: () => {
        if (pk) {
          DataPostService.deletePost(pk)
            .then(() => {
              setUpdateData(true);
            })
            .catch((error) => {
              alert(error);
            });
        }
      },
      onCancel: () => {},
    });
  };

  const handleOkForm = () => {
    setUpdateData(true);
    showFormModal();
  };

  const handleCancelForm = () => {
    showFormModal();
  };

  const columns: ColumnsType<PostType> = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (_, record) => (
        <Space size={5}>
          <Button className="action-button" type="link" onClick={() => handleEditPost(record.pk)}>
            <EditOutlined />
          </Button>
          {!record.delete_forbidden && (
            <Button className="action-button" type="link" onClick={() => handleDeletePost(record.pk)}>
              <DeleteOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Список постов"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="close" type="default" onClick={onCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormOpen && (
        <PostModalForm pk={editPk} open={modalFormOpen} onOk={handleOkForm} onCancel={handleCancelForm} />
      )}

      <Button onClick={handleAddPost}>Добавить пост</Button>

      <div className="mt-10">
        <Table
          className="table-handbook"
          size="small"
          rowKey={(record) => `${record.pk}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 450 }}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default PostsModal;
