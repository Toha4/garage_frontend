import React from "react";
import { Button } from "antd";
import WorksModal from "../../handbooks/WorksModal";
import { OrderWorkType, WorkType } from "../../../../services/types";

interface ITableOrderWorks {
  value: OrderWorkType[];
  onChange: (...event: any[]) => void;
  editMode: boolean;
}

const TableOrderWorks: React.FC<ITableOrderWorks> = ({ value, onChange, editMode }) => {
  const [openWorksModal, setOpenWorksModal] = React.useState(false);

  const handleAddWork = (works: WorkType[] | undefined) => {
    if (works) {
      const addedOrderWorks: OrderWorkType[] = [];

      for (const work of works) {
        // Если такой работы еще нету в заказ-наряде то добавляем
        if (value.findIndex((item) => work.pk === item.work) === -1) {
          addedOrderWorks.push({
            pk: null,
            work: work.pk,
            work_name: work.name,
            work_category: work.category,
            quantity: 1,
            time_minutes: 0,
            note: "",
            mechanics: [],
          });
        }
      }

      onChange([...value, ...addedOrderWorks]);
    }
  };

  const disableWorksKeys: string[] = value?.map((orderWork) => `W-${orderWork.work}`);

  return (
    <>
      {openWorksModal && (
        <WorksModal
          open={openWorksModal}
          selectMode
          onCancel={() => setOpenWorksModal(false)}
          onOk={handleAddWork}
          disableWorksKeys={disableWorksKeys}
        />
      )}
      <Button type="primary" size="small" disabled={!editMode} onClick={() => setOpenWorksModal(true)}>
        Добавить работу
      </Button>
      <ul>{value && value.map((work: any) => <li key={work.id}>{work.work_name}</li>)}</ul>
    </>
  );
};

export default TableOrderWorks;
