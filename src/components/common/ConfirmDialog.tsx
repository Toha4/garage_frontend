import { Modal } from "antd";
import { LegacyButtonType } from "antd/lib/button/button";

const { confirm } = Modal;

interface IshowConfirmDialog {
  title: React.ReactNode;
  content?: any;
  okText?: string;
  cancelText?: string;
  okType?: LegacyButtonType;
  onOk: any;
  onCancel: any;
}

const showConfirmDialog = ({
  title,
  content,
  onOk,
  onCancel,
  okText = "Да",
  cancelText = "Нет",
  okType = "danger",
}: IshowConfirmDialog) => {
  return confirm({
    title: title,
    content: content ? content : "",
    okText: okText,
    okType: okType,
    cancelText: cancelText,
    onOk: onOk,
    onCancel: onCancel,
    centered: true,
  });
};

export default showConfirmDialog;
