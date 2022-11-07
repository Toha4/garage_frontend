import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { quantityFormatter } from "../../helpers/utils";
import TurnoverService from "../../services/TurnoverService";
import { TurnoverNestedType } from "../../services/types";

interface IEntranceMaterialTable {
  entrance_pk: number;
  update_pk?: number | null;
}

interface ITurnoverMaterialTable extends TurnoverNestedType {
  pk: number;
}

const EntranceMaterialTable: React.FC<IEntranceMaterialTable> = ({ entrance_pk, update_pk }) => {
  const DataTurnoverService = new TurnoverService();

  const [dataSource, setDataSource] = React.useState<ITurnoverMaterialTable[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadingData();
  }, []);

  React.useEffect(() => {
    if (entrance_pk === update_pk) {
      loadingData();
    }
  }, [entrance_pk, update_pk]);

  const loadingData = () => {
    const onDataLoaded = (result: ITurnoverMaterialTable[]) => {
      setDataSource(result);
    };

    const onError = () => {
      setDataSource([]);
    };

    const onFinally = () => {
      setLoading(false);
    };

    setLoading(true);

    DataTurnoverService.getTurnovers({ entrance_pk }).then(onDataLoaded).catch(onError).finally(onFinally);
  };

  const columns: ColumnsType<ITurnoverMaterialTable> = [
    {
      title: "",
      key: "index",
      width: 30,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Наименование",
      dataIndex: "material_name",
      key: "material_name",
    },
    {
      title: "Склад",
      dataIndex: "warehouse_name",
      key: "warehouse",
      width: 200,
    },
    {
      title: "Цена, руб",
      dataIndex: "price",
      key: "price",
      width: 140,
      render: (_, record) => record.price.toFixed(2),
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      width: 140,
      render: (_, record) =>
        quantityFormatter(
          record.quantity || 0,
          record.material_unit_is_precision_point || false,
          record.material_unit_name || ""
        ),
    },
    {
      title: "Сумма, руб.",
      dataIndex: "sum",
      key: "sum",
      width: 140,
      render: (_, record) => record.price.toFixed(2),
    },
  ];

  return (
    <Table
      rowKey={(record) => record.pk}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      loading={loading}
      locale={{ emptyText: "Нет материалов" }}
      size="small"
      showHeader={dataSource.length !== 0}
    />
  );
};

export default EntranceMaterialTable;
