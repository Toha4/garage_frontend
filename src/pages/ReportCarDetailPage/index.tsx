import { Typography } from "antd";
import React from "react";
import OrderModalForm from "../../components/modals/OrderModal";
import { ActionTypes } from "../../helpers/types";
import CarService from "../../services/CarService";
import { CarType } from "../../services/types";
import CarStatistics from "./CarStatistics";
import ReportFilter, { ReportFilterType } from "./ReportCarsFilter";
import TableCarOrders from "./TableCarOrders";

const { Title } = Typography;

const ReportCarDetailPage: React.FC = () => {
  const DataCarService = new CarService();

  const [carInfo, setCarInfo] = React.useState<CarType>();
  const [reportFilter, setReportFilter] = React.useState<ReportFilterType>({});

  const [update, setUpdate] = React.useState<boolean>(false);
  const [updateStatistic, setUpdateStatistic] = React.useState<boolean>(false);
  const [updateTableOrders, setUpdateTableOrders] = React.useState<boolean>(false);

  const [orderOpenModal, setOrderOpenModal] = React.useState<boolean>(false);
  const [orderPkOpen, setOrderPkOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = (results: CarType) => {
      setCarInfo(results);
    };

    const onError = () => {
      setCarInfo(undefined);
    };

    const onFinally = () => {
      setUpdate(false);
    };

    if (update) {
      const car_pk = reportFilter["car"] as number;
      DataCarService.getCar(car_pk).then(onDataLoaded).catch(onError).finally(onFinally);
    }
  }, [update]);

  const handleUpdate = () => {
    setUpdate(true);
    setUpdateStatistic(true);
    setUpdateTableOrders(true);
  };

  const handleOpenOrder = (order_pk: number) => {
    setOrderPkOpen(order_pk);
    setOrderOpenModal(true);
  };

  const handleCloseOrder = () => {
    setOrderPkOpen(null);
    setOrderOpenModal(false);
  };

  return (
    <>
      {orderOpenModal && orderPkOpen && (
        <OrderModalForm
          readOnlyMode
          orderPk={orderPkOpen}
          open={orderOpenModal}
          actionForm={ActionTypes.EDIT}
          handleOk={handleCloseOrder}
          handleCancel={handleCloseOrder}
        />
      )}

      <Title className="mt-10 ml-10" level={4}>
        Подробный отчет по ТС
      </Title>
      <ReportFilter
        filter={reportFilter}
        setReportFilter={setReportFilter}
        onUpdate={handleUpdate}
        loadingData={updateStatistic && updateTableOrders}
      />
      <CarStatistics
        carName={carInfo?.name || ""}
        carStateNumber={carInfo?.state_number || ""}
        updateStatistic={updateStatistic}
        setUpdateStatistic={setUpdateStatistic}
        filter={reportFilter}
        onOpenOrder={handleOpenOrder}
      />

      <TableCarOrders
        carName={carInfo?.name || ""}
        carStateNumber={carInfo?.state_number || ""}
        updateCarOrders={updateTableOrders}
        setUpdateCarOrders={setUpdateTableOrders}
        filter={reportFilter}
        onOpenOrder={handleOpenOrder}
      />
    </>
  );
};

export default ReportCarDetailPage;
