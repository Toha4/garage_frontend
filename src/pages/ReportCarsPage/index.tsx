import { QuestionCircleOutlined } from "@ant-design/icons";
import { Typography, Table, Popover, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import OrderModalForm from "../../components/modals/OrderModal";
import MaterialList from "../../components/report_popover_lists/MaterialList";
import OrderList from "../../components/report_popover_lists/OrderList";
import WorkList from "../../components/report_popover_lists/WorkList";
import { ActionTypes } from "../../helpers/types";
import { hoursFormatter } from "../../helpers/utils";
import ReportService from "../../services/ReportService";
import { ReportCarType, ReportOrderShortType } from "../../services/types";
import ReportFilter, { ReportFilterType } from "./ReportCarsFilter";

const { Title, Text } = Typography;

const ReportCarsPage: React.FC = () => {
  const DataReportService = new ReportService();

  const [dataSource, setDataSource] = React.useState<ReportCarType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);
  const [reportFilter, setReportFilter] = React.useState<ReportFilterType>({});
  const [update, setUpdate] = React.useState<boolean>(false);

  const [orderOpenModal, setOrderOpenModal] = React.useState<boolean>(false);
  const [orderPkOpen, setOrderPkOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = (results: ReportCarType[]) => {
      setDataSource(results);
    };

    const onError = () => {
      setDataSource([]);
    };

    const onFinally = () => {
      setUpdate(false);
      setLoading(false);
    };

    if (update) {
      setLoading(true);

      DataReportService.getReportCars({ ...reportFilter })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleExportExcel = () => {
    setLoadingExport(true);

    DataReportService.exportReportCarsExcel({ ...reportFilter })
      .then((data) => {
        const link = document.createElement("a");
        link.href = data.file;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const handleOpenOrder = (order_pk: number) => {
    setOrderPkOpen(order_pk);
    setOrderOpenModal(true);
  };

  const handleCloseOrder = () => {
    setOrderPkOpen(null);
    setOrderOpenModal(false);
  };

  const joinNotes = (orders: ReportOrderShortType[]) => {
    let notes = "";
    for (const order of orders) {
      if (order.note !== "") {
        if (notes !== "") {
          notes += "; ";
        }
        notes += order.note;
      }
    }

    return notes;
  };

  const columns: ColumnsType<ReportCarType> = [
    {
      title: "№ п/п",
      key: "number",
      width: 80,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Гос. №",
      key: "state_number",
      dataIndex: "state_number",
      width: 170,
    },
    {
      title: "Марка и модель",
      key: "name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: () => (
        <div>
          <span>Всего заказ-нарядов по ТС </span>
          <Popover
            content={
              <Space direction="vertical" size={2}>
                <Text>Наведите на ячейку, чтобы посмотреть список заказ-нарядов по ТС.</Text>
                <br />
                <Text>
                  В отчет попадают заказ-наряды <span style={{ fontWeight: "bold" }}>выполненные</span> за выбранный
                  период.
                </Text>
              </Space>
            }
          >
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      dataIndex: "order_total",
      key: "order_total",
      width: 170,
      render: (text, record) => (
        <Popover
          open={orderOpenModal ? false : undefined}
          trigger={orderOpenModal ? "click" : "hover"}
          content={<OrderList orders={record.orders} handleOpenOrder={handleOpenOrder} />}
        >
          <div style={{ minHeight: "22px" }}>{text}</div>
        </Popover>
      ),
    },
    {
      title: () => (
        <div>
          <span>Затрачено рабочего времени </span>
          <Popover
            content={
              <Space direction="vertical" size={2}>
                <Text>Наведите на ячейку, чтобы посмотреть список выполненных работ по ТС.</Text>
                <br />
                <Text>
                  В отчет попадают работы из заказ-нарядов <span style={{ fontWeight: "bold" }}>выполненных</span> за
                  выбранный период.
                </Text>
              </Space>
            }
          >
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      key: "work_minutes_total",
      dataIndex: "work_minutes_total",
      width: 170,
      render: (_, record) => (
        <Popover
          open={orderOpenModal ? false : undefined}
          trigger={orderOpenModal ? "click" : "hover"}
          content={<WorkList works={record.works} handleOpenOrder={handleOpenOrder} />}
        >
          <div style={{ minHeight: "22px" }}>{hoursFormatter(record.work_minutes_total)}</div>
        </Popover>
      ),
    },
    {
      title: () => (
        <div>
          <span>Затрачено, руб </span>
          <Popover
            placement="topRight"
            content={
              <Space direction="vertical" size={2}>
                <Text>Наведите на ячейку, чтобы посмотреть список израсходованных материалов по ТС.</Text>
                <br />
                <Text>
                  В отчет попадают материалы из заказ-нарядов <span style={{ fontWeight: "bold" }}>выполненных</span> за
                  выбранный период.
                </Text>
              </Space>
            }
          >
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      key: "sum_total",
      dataIndex: "sum_total",
      width: 170,
      render: (_, record) => (
        <Popover
          placement="topRight"
          open={orderOpenModal ? false : undefined}
          trigger={orderOpenModal ? "click" : "hover"}
          content={<MaterialList materials={record.materials} handleOpenOrder={handleOpenOrder} />}
        >
          <div style={{ minHeight: "22px" }}>{record.sum_total.toFixed(2)}</div>
        </Popover>
      ),
    },
    {
      title: "Примечание",
      key: "note",
      dataIndex: "note",
      width: 300,
      render: (_, record) => `${joinNotes(record.orders)}`,
    },
    {},
  ];

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
        Отчет по ремонту ТС
      </Title>
      <ReportFilter
        filter={reportFilter}
        setReportFilter={setReportFilter}
        updateTable={setUpdate}
        onExportExcel={handleExportExcel}
        loadingData={loading}
        loadingExport={loadingExport}
      />
      <Table
        bordered
        rowKey={(record) => record.pk}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{
          y: "calc(100vh - 215px)",
        }}
        pagination={false}
        locale={{ emptyText: "Выберите период и нажмите сформировать" }}
      />
    </>
  );
};

export default ReportCarsPage;
