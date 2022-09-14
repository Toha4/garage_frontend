import { notification } from "antd";
import { IconType, NotificationPlacement } from "antd/lib/notification";

export function openNotification(message: string, type: IconType, title = '', placement: NotificationPlacement = 'topRight', className = undefined, style = {}) {
  notification[type]({
    message: title,
    description: message,
    placement,
    style,
    className
  });
}
