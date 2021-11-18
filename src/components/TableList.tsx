import React, { useState, useEffect } from "react";
import { getTables, getOrders, saveCompleted } from "../services/floorService";
import { ITable, IOrder } from "../types/types";
import Msg from "./Msg";

interface ResTable extends ITable {
  occupied?: boolean;
  start?: number;
  mobile?: string;
  numOfDiners: number;
}

interface CompletedOrder extends IOrder {
  tables?: number;
  start_time?: number;
  end_time?: number;
}

const TableList = (props: any) => {
  const [tables, setTables] = useState<ResTable[] | null>(null);
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [freeTables, setFreeTables] = useState<number>(0);
  const [tableData, setTableData] = useState<ResTable | null>(null);
  let freeTablesx = 0;
  useEffect(() => {
    const getTablesData = async () => {
      const data = await getTables();
      if (data) {
        const tablesCopy = data.slice();
        setFreeTables(tablesCopy.length);
        setTables(tablesCopy);
      }
      return data;
    };
    const getOrdersData = async () => {
      const data = await getOrders();
      if (data) {
        const ordersCopy = data.slice();
        setOrders(ordersCopy);
      }
      return null;
    };
    getTablesData();
    getOrdersData();
  }, []);

  useEffect(() => {
    if (tables && orders.length > 0) findTable();
  }, [tables, orders]);

  const occupyTable = (idx: number, order: IOrder) => {
    freeTablesx--;
    setFreeTables(freeTablesx);

    if (tables) {
      const start = Date.now();
      tables[idx] = {
        ...tables[idx],
        occupied: true,
        start: start,
        mobile: order.Mobile,
        numOfDiners: order.Diners,
      };
      const handledOrder = orders.shift();
      let orderToSave: CompletedOrder;
      if (handledOrder) {
        orderToSave = {
          ...handledOrder,
          tables: tables[idx].Table,
          start_time: start,
        };

        setTables(tables);
        setOrders(orders);

        setTimeout(() => {
          handleReservationComplete(orderToSave, idx);
        }, 10 * 1000);
      }
    }
  };

  const handleReservationComplete = (order: CompletedOrder, idx: number) => {
    order.end_time = Date.now();

    saveCompleted(order);
    if (tables) {
      tables[idx].occupied = false;
      tables[idx].start = 0;
    }
    setTables(tables);
    findTable();
  };

  const findTable = () => {
    if (tables && orders.length > 0) {
      freeTablesx = tables.filter((table) => table.occupied !== false).length;

      while (orders.length > 0 && freeTables > 0) {
        // let freeTableIdx;
        const bestMatchIdx = tables.findIndex(
          (table) => table.Diners === orders[0].Diners && !table.occupied
        );

        if (bestMatchIdx >= 0) {
          // freeTableIdx = bestMatchIdx;
          occupyTable(bestMatchIdx, orders[0]);
        } else if (bestMatchIdx < 0) {
          const matchIdx = tables.findIndex(
            (table) => table.Diners > orders[0].Diners
          );
          if (matchIdx >= 0) {
            // freeTableIdx = matchIdx;
            occupyTable(matchIdx, orders[0]);
          }
        }
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {tableData && <Msg data={tableData} onExit={setTableData} />}
      <h2>Tables</h2>
      {tables && (
        <div>
          {tables.map((table) => {
            const numOfDiners = table.Diners < 5 ? table.Diners : 5;
            const style = table.occupied
              ? { fill: "full", clicks: "enabled" }
              : { fill: "vacant", clicks: "disabled" };

            return (
              <img
                id={`${table.Table}`}
                className={style.clicks}
                src={`../assets/images/${numOfDiners}${style.fill}.png`}
                alt={`Table for ${numOfDiners} diners`}
                onClick={() => setTableData(table)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableList;
