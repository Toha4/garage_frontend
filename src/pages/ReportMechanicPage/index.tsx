import { QuestionCircleOutlined } from "@ant-design/icons";
import { Typography, Table, Popover, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import OrderModalForm from "../../components/modals/OrderModal";
import WorkList from "../../components/report_popover_lists/WorkList";
import { ActionTypes } from "../../helpers/types";
import { hoursFormatter } from "../../helpers/utils";
import ReportService from "../../services/ReportService";
import { ReportMechanicType } from "../../services/types";
import ReportFilter, { ReportFilterType } from "./ReportMechanicsFilter";

const { Title, Text } = Typography;

const ReportMechanicsPage: React.FC = () => {
  const DataReportService = new ReportService();

  const [dataSource, setDataSource] = React.useState<ReportMechanicType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);
  const [reportFilter, setReportFilter] = React.useState<ReportFilterType>({});
  const [update, setUpdate] = React.useState<boolean>(false);

  const [orderOpenModal, setOrderOpenModal] = React.useState<boolean>(false);
  const [orderPkOpen, setOrderPkOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = (results: ReportMechanicType[]) => {
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

      DataReportService.getReportMechanics({ ...reportFilter })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleExportExcel = () => {
    setLoadingExport(true);

    DataReportService.exportReportMechanicsExcel({ ...reportFilter })
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

  const columns: ColumnsType<ReportMechanicType> = [
    {
      title: "№ п/п",
      key: "number",
      width: 80,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "ФИО",
      key: "short_fio",
      dataIndex: "short_fio",
      width: 200,
    },
    {
      title: () => (
        <div>
          <span>Отработано часов по ЗН </span>
          <Popover
            content={
              <Space direction="vertical" size={2}>
                <Text>Наведите на ячейку, чтобы посмотреть список работ выполненных работником</Text>
                <br />
                <Text>
                  В отчет попадают работы из заказ-нарядов <span style={{ fontWeight: "bold" }}>выполненных</span> за
                  выбранный период
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
      width: 160,
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
          <span>Участие в ремонте единиц ТС </span>
          <Popover content="Количество уникальных ТС в ремонте которых участвовал работник за выбранный период">
            <QuestionCircleOutlined />
          </Popover>
        </div>
      ),
      key: "repaired_cars_total",
      dataIndex: "repaired_cars_total",
      width: 160,
    },
    {
      title: "Примечание",
      key: "note",
      dataIndex: "note_list",
      width: 500,
      render: (_, record) => record.note_list.join("; "),
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
        Отчет по работникам
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
          y: "calc(100vh - 240px)",
        }}
        pagination={false}
        locale={{ emptyText: "Выберите период и нажмите сформировать" }}
      />
    </>
  );
};

export default ReportMechanicsPage;
