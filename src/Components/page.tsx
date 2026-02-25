import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import "../index.css";
import type { DataTableValueArray, DataTableValue } from "primereact/datatable";

interface Pageprop {
  rows: number;
  pro: DataTableValueArray[];
  setTotal: React.Dispatch<React.SetStateAction<number>>;

  Spro: DataTableValue;

  setSpro: React.Dispatch<
    React.SetStateAction<DataTableValueArray[] | DataTableValue>
  >;
  pageNumprop: number;
  setPro: React.Dispatch<React.SetStateAction<DataTableValueArray[]>>;
}

function DynamicColumnsDemo({
  rows,
  pro,
  setTotal,
  pageNumprop,
  setPro,
  setSpro,
  Spro,
}: Pageprop) {
  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Origin" },
    { field: "artist_display", header: "Artist" },
    { field: "inscriptions", header: "inscriptions" },
    { field: "date_start", header: "Start Year" },
    { field: "date_end", header: "End Year" },
  ];

  useEffect(() => {
    async function fetch() {
      try {
        const data2 = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${pageNumprop}&limit=${rows}`,
        );

        const fetchdata = data2.data.data;
        setPro(fetchdata);

        console.log("pageNum", pageNumprop);

        setTotal(data2.data.pagination.total);
      } catch (error) {
        console.error(error);
      }
    }

    fetch();
  }, [rows, pageNumprop]);

  console.log("selectedpro", Spro);

  return (
    <div className=" h-170 overflow-y-auto">
      <div className="card">
        <div className="absolute z-3 top-2 font-bold left-40">
          Total selected rows {Spro?.length}/{rows}
        </div>
        <DataTable
          value={pro}
          tableStyle={{ minWidth: "60rem" }}
          selection={Spro}
          onSelectionChange={(e) => {
            const addnew = e.value;

            setSpro((prev) => {
              const withoutdupli = prev.filter(
                (item: object) =>
                  !pro.some(
                    (p) =>
                      (p as unknown as { id: number }).id ===
                      (item as unknown as { id: number }).id,
                  ),
              ); //if match then remove from Spro by filter
              //pro stands for products
              return [...withoutdupli, ...addnew]; //comp
            });
          }}
          dataKey="id"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export default DynamicColumnsDemo;
