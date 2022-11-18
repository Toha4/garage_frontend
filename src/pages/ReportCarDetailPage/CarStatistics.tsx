import { Button, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { Dispatch, SetStateAction } from "react";
import ReportService from "../../services/ReportService";
import { StatisticParamsType } from "../../services/types";
import { ReportFilterType } from "./ReportCarsFilter";

const { Title } = Typography;

interface ICarStatistics {
  carName: string;
  carStateNumber: string;
  filter: ReportFilterType;
  onOpenOrder: (order_pk: number) => void;
  updateStatistic: boolean;
  setUpdateStatistic: Dispatch<SetStateAction<boolean>>;
}

const CarStatistics: React.FC<ICarStatistics> = ({
  carName,
  carStateNumber,
  filter,
  onOpenOrder,
  updateStatistic,
  setUpdateStatistic,
}) => {
  const DataReportService = new ReportService();

  const [dataSource, setDataSource] = React.useState<StatisticParamsType[]>();
  const [loadingExport, setLoadingExport] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onDataLoaded = (results: StatisticParamsType[]) => {
      setDataSource(results);
    };

    const onError = () => {
      setDataSource(undefined);
    };

    const onFinally = () => {
      setUpdateStatistic(false);
    };

    if (updateStatistic) {
      DataReportService.getStatistiCar({ ...filter })
        .then(onDataLoaded)
        .catch(onError)
        .finally(onFinally);
    }
  }, [updateStatistic]);

  const handleExportToExcel = () => {
    setLoadingExport(true);

    DataReportService.exportStatistiCarExcel({ ...filter })
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

  const columns: ColumnsType<StatisticParamsType> = [
    {
      title: "",
      key: "name_param",
      dataIndex: "name_param",
      width: 300,
    },
    {
      title: "Всего",
      key: "total",
      dataIndex: "total",
      width: 120,
    },
    {
      title: "ТО",
      key: "maintenance",
      dataIndex: "maintenance",
      width: 120,
    },
    {
      title: "Ремонт",
      key: "repair",
      dataIndex: "repair",
      width: 120,
    },
    {
      title: "Прочее",
      key: "other",
      dataIndex: "other",
      width: 120,
    },
  ];

  return (
    <div style={{ width: "660px" }}>
      {dataSource && (
        <>
          <Space>
            <Title className="m-10" level={5}>{`Статистика по ${carName} гос. № ${carStateNumber}:`}</Title>
            <Button size="small" onClick={handleExportToExcel} loading={loadingExport}>
              В Excel
            </Button>
          </Space>
          <Table
            bordered
            size="small"
            rowKey={(record) => record.name_param}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default CarStatistics;
