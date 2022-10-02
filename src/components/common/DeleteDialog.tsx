import { Modal } from "antd";

const { confirm } = Modal;

interface IshowDeleteConfirmDialog {
  title: React.ReactNode;
  content?: any;
  onOk: any;
  onCancel: any;
}

const showDeleteConfirmDialog = ({ title, content, onOk, onCancel }: IshowDeleteConfirmDialog) => {
  return confirm({
    title: title,
    content: content ? content : "",
    okText: "Да",
    okType: "danger",
    cancelText: "Нет",
    onOk: onOk,
    onCancel: onCancel,
  });
};

export default showDeleteConfirmDialog;
