import { QuestionCircleOutlined } from "@ant-design/icons";
import { Typography, Table, Popover, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import OrderModalForm from "../../components/modals/OrderModal";
import MaterialList from "../../components/report_popover_lists/MaterialList";
import { ActionTypes } from "../../helpers/types";
import { quantityFormatter } from "../../helpers/utils";
import ReportService from "../../services/ReportService";
import { ReportMaterialType } from "../../services/types";
import ReportFilter, { ReportFilterType } from "./ReportMaterialsFilter";

const { Title, Text } = Typography;

const ReportMaterialsPage: React.FC = () => {
  const DataReportService = new ReportService();

  const [dataSource, setDataSource] = React.useState<ReportMaterialType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);
  const [reportFilter, setReportFilter] = React.useState<ReportFilterType>({});
  const [update, setUpdate] = React.useState<boolean>(false);

  const [orderOpenModal, setOrderOpenModal] = React.useState<boolean>(false);
  const [orderPkOpen, setOrderPkOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    const onDataLoaded = (results: ReportMaterialType[]) => {
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

      DataReportService.getReportMaterials({ ...reportFilter })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [update]);

  const handleExportExcel = () => {
    setLoadingExport(true);

    DataReportService.exportReportMaterialsExcel({ ...reportFilter })
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

  const columns: ColumnsType<ReportMaterialType> = [
    {
      title: "№ п/п",
      key: "number",
      width: 80,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Наименование",
      key: "name",
      dataIndex: "name",
      width: 380,
    },
    {
      title: "Склад",
      key: "warehouse_name",
      dataIndex: "warehouse_name",
      width: 160,
    },
    {
      title: () => (
        <div>
          <span>Использовано </span>
          <Popover
            content={
              <Space direction="vertical" size={2}>
                <Text>Наведите на ячейку, чтобы посмотреть заказ-наряды в которых был использован материал.</Text>
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
      key: "used_quantity",
      dataIndex: "used_quantity",
      width: 150,
      render: (_, record) => (
        <Popover
          open={orderOpenModal ? false : undefined}
          trigger={orderOpenModal ? "click" : "hover"}
          content={<MaterialList skipName materials={record.turnovers} handleOpenOrder={handleOpenOrder} />}
        >
          <div style={{ minHeight: "22px" }}>
            {quantityFormatter(
              record.used_quantity,
              record.material_unit_is_precision_point,
              record.material_unit_name
            )}
          </div>
        </Popover>
      ),
    },
    {
      title: "Стоимость, руб.",
      key: "used_sum",
      dataIndex: "used_sum",
      width: 140,
      render: (_, record) => record.used_sum.toFixed(2),
    },
    {
      title: `${reportFilter["date_end"] ? "Остаток на " + reportFilter["date_end"] : "Остаток"}`,
      key: "remains_quantity",
      dataIndex: "remains_quantity",
      width: 140,
      render: (_, record) =>
        quantityFormatter(record.remains_quantity, record.material_unit_is_precision_point, record.material_unit_name),
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
        Отчет по материалам
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

export default ReportMaterialsPage;
