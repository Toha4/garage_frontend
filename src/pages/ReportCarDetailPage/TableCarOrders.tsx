import { Button, Space, Table, Typography } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { Dispatch, SetStateAction } from "react";
import { ITableParams } from "../../components/interface";
import { hoursFormatter } from "../../helpers/utils";
import ReportService from "../../services/ReportService";
import { ReportCarOrders, ResultResursePagation } from "../../services/types";
import { ReportFilterType } from "./ReportCarsFilter";

const { Title } = Typography;

const TableParamsDefault: ITableParams = {
  pagination: {},
  sortField: undefined,
  sortOrder: undefined,
  filters: undefined,
  search: {},
};

interface ITableCarOrders {
  carName: string;
  carStateNumber: string;
  filter: ReportFilterType;
  onOpenOrder: (order_pk: number) => void;
  updateCarOrders: boolean;
  setUpdateCarOrders: Dispatch<SetStateAction<boolean>>;
}

const TableCarOrders: React.FC<ITableCarOrders> = ({
  carName,
  carStateNumber,
  filter,
  onOpenOrder,
  updateCarOrders,
  setUpdateCarOrders,
}) => {
  const DataReportService = new ReportService();

  const [dataSource, setDataSource] = React.useState<ReportCarOrders[]>();
  const [tableParams, setTableParams] = React.useState<ITableParams>(TableParamsDefault);
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = ({ page_size, count, numbers, results }: ResultResursePagation<ReportCarOrders>) => {
      tableParams.pagination = {
        ...tableParams.pagination,
        pageSize: page_size,
        total: count,
        current: numbers.current,
      };

      setDataSource(results);
      setTableParams(tableParams);
    };

    const onError = (error: any) => {
      alert(error);
    };

    const onFinally = () => {
      setUpdateCarOrders(false);
    };

    if (updateCarOrders) {
      DataReportService.getReportOrdersCar({ ...filter, page: tableParams.pagination?.current })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [updateCarOrders]);

  const handleExportToExcel = () => {
    setLoadingExport(true);

    DataReportService.exportReportCarOrdersExcel({ ...filter })
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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ReportCarOrders> | SorterResult<ReportCarOrders>[]
  ) => {
    const _sorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setTableParams({
      ...tableParams,
      pagination: pagination,
      sortField: _sorter.columnKey,
      sortOrder: _sorter.order,
    });
    setUpdateCarOrders(true);
  };

  const columns: ColumnsType<ReportCarOrders> = [
    {
      title: "Дата",
      key: "date_begin",
      dataIndex: "date_begin",
      width: 100,
    },
    {
      title: "Заказ-наряд",
      key: "number",
      dataIndex: "number",
      width: 120,
      render: (_, record) => (
        <Button style={{ paddingLeft: "0px" }} type="link" onClick={() => onOpenOrder(record.pk)}>
          {`№${record.number}`}
        </Button>
      ),
    },
    {
      title: "Причина",
      key: "reason_name",
      dataIndex: "reason_name",
      width: 180,
    },
    {
      title: "Список работ",
      key: "works",
      dataIndex: "works",
      width: 300,
      render: (_, record) => (
        <ul style={{ marginBottom: "0px", listStyleType: "none" }}>
          {record.work_list.map((work) => (
            <li key={work}>{`- ${work};`}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Всего затрачено времени",
      key: "work_minutes_total",
      dataIndex: "work_minutes_total",
      width: 100,
      render: (_, record) => hoursFormatter(record.work_minutes_total),
    },
    {
      title: "Список материалов",
      key: "materials",
      dataIndex: "materials",
      width: 300,
      render: (_, record) => (
        <ul style={{ marginBottom: "0px", listStyleType: "none" }}>
          {record.material_list.map((material) => (
            <li key={material}>{`- ${material};`}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Сумма на материалы, руб.",
      key: "sum_total",
      dataIndex: "sum_total",
      width: 100,
      render: (_, record) => record.sum_total.toFixed(2),
    },
    {
      title: "Примечание",
      key: "note",
      dataIndex: "note",
    },
  ];

  return (
    <>
      {dataSource && (
        <>
          <Space>
            <Title className="m-10" level={5}>{`Заказ-наряды по ${carName} гос. № ${carStateNumber}:`}</Title>
            <Button size="small" onClick={handleExportToExcel}>
              В Excel
            </Button>
          </Space>
          <Table
            bordered
            size="small"
            rowKey={(record) => record.pk}
            columns={columns}
            dataSource={dataSource}
            onChange={handleTableChange}
            pagination={{ ...tableParams.pagination, showSizeChanger: false }}
            locale={{ emptyText: " " }}
          />
        </>
      )}
    </>
  );
};

export default TableCarOrders;
