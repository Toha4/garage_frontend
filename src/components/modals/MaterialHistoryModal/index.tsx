import { Button, Col, Modal, Radio, RadioChangeEvent, Row, Select, Space, Tooltip } from "antd";
import React from "react";
import UserContext from "../../../helpers/UserContext";
import { quantityFormatter } from "../../../helpers/utils";
import MaterialService from "../../../services/MaterialService";
import { MaterialAvailabilityType } from "../../../services/types";
import CorrectionMaterialTurnoverModalForm from "../../forms/CorrectionMaterialTurnoverModalForm";
import MovingMaterialModalForm from "../../forms/MovingMaterialModalForm";
import TableTurnover from "./TableTurnover";

const { Option } = Select;

const FilterTurnoverOptions = [
  { label: "Все", value: 0 },
  { label: "Приход", value: 1 },
  { label: "Расход", value: 2 },
];

interface IMaterialHistoryModal {
  materialId: number;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const MaterialHistoryModal: React.FC<IMaterialHistoryModal> = ({ materialId, open, onOk, onCancel }) => {
  const user = React.useContext(UserContext);

  const DataMaterialService = new MaterialService();

  const [data, setData] = React.useState<MaterialAvailabilityType>();
  const [update, setUpdate] = React.useState<boolean>(true);
  const [updateTable, setUpdateTable] = React.useState<boolean>(true);
  const [isUpdated, setIsUpdated] = React.useState<boolean>(false);
  const [filterTurnoverType, setFilterTurnoverType] = React.useState<number>(0);
  const [filterTurnoverWarehouse, setFilterTurnoverWarehouse] = React.useState<number | undefined>(undefined);
  const [modalFormCorrectionOpen, setModalFormCorrectionOpen] = React.useState<boolean>(false);
  const [modalFormMovingOpen, setModalFormMovingOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (data: MaterialAvailabilityType) => {
      setData(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    const onFinally = () => {
      setUpdate(false);
    };

    if (update) {
      DataMaterialService.getMaterial(materialId, { availability_mode: true })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleCancel = () => {
    if (isUpdated) {
      onOk();
    } else {
      onCancel();
    }
  };

  const onChangeFilterTurnoverType = ({ target: { value } }: RadioChangeEvent) => {
    setFilterTurnoverType(value);
    setUpdateTable(true);
  };

  const onChangeFilterTurnoverWarehouse = (value: any, option: any) => {
    setFilterTurnoverWarehouse(value);
    setUpdateTable(true);
  };

  const handleCorrection = () => {
    setModalFormCorrectionOpen(true);
  };

  const handleMoving = () => {
    setModalFormMovingOpen(true);
  };

  const handleOkCorrection = () => {
    setModalFormCorrectionOpen(false);
    setUpdate(true);
    setUpdateTable(true);
    setIsUpdated(true);
  };

  const handleCancelCorrection = () => {
    setModalFormCorrectionOpen(false);
  };

  const handleOkMoving = () => {
    setModalFormMovingOpen(false);
    setUpdate(true);
    setUpdateTable(true);
    setIsUpdated(true);
  };

  const handleCancelMoving = () => {
    setModalFormMovingOpen(false);
  };

  let quantity: number = data?.quantity || 0.0;
  let last_price: number = data?.prices.last_price || 0.0;
  let average_price: number = data?.prices.average_price || 0.0;
  if (filterTurnoverWarehouse && data) {
    const warehouse = data.warehouses_availability.find((item) => item.warehouse === filterTurnoverWarehouse);
    quantity = warehouse?.quantity || 0.0;
    last_price = warehouse?.prices?.last_price || 0.0;
    average_price = warehouse?.prices?.average_price || 0.0;
  }

  const edit_access = user ? user.edit_access : false;

  const active_moving_button = Boolean(edit_access && filterTurnoverWarehouse && quantity > 0.0);

  return (
    <Modal
      title={`История "${data ? data?.name : ""}"`}
      open={open}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button
          key="correct"
          type="primary"
          style={{ float: "left" }}
          disabled={!edit_access}
          onClick={handleCorrection}
        >
          Корректировка
        </Button>,
        <Button key="submit" onClick={handleCancel}>
          Закрыть
        </Button>,
      ]}
    >
      {modalFormCorrectionOpen && data && (
        <CorrectionMaterialTurnoverModalForm
          materialId={data.id}
          materialName={data.name}
          unit_name={data.unit_name}
          unit_is_precision_point={data.unit_is_precision_point}
          warehousesAvailability={data.warehouses_availability}
          prices={data.prices}
          open={modalFormCorrectionOpen}
          onOk={handleOkCorrection}
          onCancel={handleCancelCorrection}
        />
      )}
      {modalFormMovingOpen && data && filterTurnoverWarehouse && (
        <MovingMaterialModalForm
          materialId={data.id}
          materialName={data.name}
          unit_name={data.unit_name}
          unit_is_precision_point={data.unit_is_precision_point}
          warehouseOutgoing={filterTurnoverWarehouse}
          maxQuantity={quantity}
          price={average_price}
          open={modalFormMovingOpen}
          onOk={handleOkMoving}
          onCancel={handleCancelMoving}
        />
      )}

      <Row gutter={24}>
        <Col span={10}>
          <div>
            <Select
              allowClear
              style={{ width: "212px" }}
              placeholder="Все склады"
              onChange={onChangeFilterTurnoverWarehouse}
              notFoundContent="Материал на складах не найден"
            >
              {data?.warehouses_availability.map((warehouse, _) => (
                <Option key={warehouse.warehouse} value={warehouse.warehouse}>
                  {warehouse.warehouse_name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mt-15">
            <Radio.Group
              optionType="button"
              options={FilterTurnoverOptions}
              onChange={onChangeFilterTurnoverType}
              value={filterTurnoverType}
            />
          </div>
        </Col>
        <Col span={14}>
          <Space size={50} align="start">
            <div style={{ width: "103px", textAlign: "center" }}>
              <div>{"Остаток: "}</div>
              <div style={{ fontWeight: "bold" }}>
                {quantityFormatter(quantity, data?.unit_is_precision_point || false, data?.unit_name || "")}
              </div>
              <Tooltip title={active_moving_button ? "" : "Выберите склад"}>
                <Button type="primary" size="small" disabled={!active_moving_button} onClick={handleMoving}>
                  Переместить
                </Button>
              </Tooltip>
            </div>
            <div style={{ textAlign: "center" }}>
              <div>{"Последняя цена: "}</div>
              <div style={{ fontWeight: "bold" }}>{`${last_price.toFixed(2)} руб.`}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div>{"Средняя цена: "}</div>
              <div style={{ fontWeight: "bold" }}>{`${average_price.toFixed(2)} руб.`}</div>
            </div>
          </Space>
        </Col>
      </Row>

      <TableTurnover
        materialId={materialId}
        filterType={filterTurnoverType > 0 ? filterTurnoverType : undefined}
        filterWarehouse={filterTurnoverWarehouse}
        update={updateTable}
        setUpdate={setUpdateTable}
      />
    </Modal>
  );
};

export default MaterialHistoryModal;
