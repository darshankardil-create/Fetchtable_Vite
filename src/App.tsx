import React, { useState, useRef } from "react";
import Page from "./Components/page.tsx";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { PrimeIcons } from "primereact/api";
import type { DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import type { DataTableValueArray, DataTableValue } from "primereact/datatable";

export default function BasicDemo() {
  const [pageNum, setpageNum] = useState<number>(() => {
    const stored = localStorage.getItem("pageNum"); // stores to survive reload and updates on incre or decre of pageNo
    return stored ? Number(stored) : 1;
  });

  const mylimit = 15;

  const [rows, setRows] = useState(8);
  const [count, setCount] = useState("");
  const [Spro, setSpro] = useState<DataTableValueArray[] | DataTableValue>([]);
  const [pro, setPro] = useState<DataTableValueArray[]>([]);

  const [total, setTotal] = useState<number>(0);

  const [num] = useState(() => {
    const arr = [];
    for (let i = 1; i < 100; i++) {
      arr.push(i);
    }
    return arr;
  });

  React.useEffect(() => {
    if (pageNum) {
      localStorage.setItem("pageNum", String(pageNum));
    }
  }, [pageNum]);

  const toast = useRef<Toast | null>(null);

  const showError = () => {
    toast.current?.show({
      severity: "error",
      summary: "Rows limit exceeded!",
      detail: `Max limit is ${mylimit} per page`,
      life: 3000,
    });
  };

  const Cusselect = Number(count);

  const cantselect = () => {
    toast.current?.show({
      severity: "error",
      summary: `Cant select ${Cusselect}!`,
      detail: `total present rows are ${rows} cant select beyond it `,
      life: 3000,
    });
  };

  function handlepageplus() {
    if (pageNum >= Number((total ? total : 0 / mylimit).toFixed(0))) return;
    setpageNum((p) => p + 1);
  }

  function numRow(e: DropdownChangeEvent) {
    if (e.value > mylimit) {
      showError();
      setRows(mylimit);
      return;
    }

    setRows(e.value);
  }

  function handlepage() {
    if (pageNum === 1) return;
    setpageNum((p) => p - 1);
  }

  function handleRowS() {
    if (Cusselect > rows) {
      cantselect();
    }

    if (Cusselect || Cusselect >= 0) {
      const rowsS = pro.slice(0, Cusselect);
      setSpro((p) => [...(p as unknown[]), ...rowsS]);
    }
  }

  return (
    <div className="pb-20 pt-10 bg-[#cbd5e1]">
      <Toast ref={toast} />
      <Page
        rows={rows}
        setTotal={setTotal}
        pageNumprop={pageNum}
        setPro={setPro}
        Spro={Spro}
        setSpro={setSpro}
        pro={pro}
      />

      <div className="card absolute top-[93%] left-[35%]">
        <div className="flex gap-13 relative right-[30%]">
          <div className="font-bold">
            Showing {rows || mylimit} out of: {total}
          </div>

          <button className="cursor-pointer" onClick={handlepage}>
            <div className={PrimeIcons.ARROW_LEFT}></div>
          </button>

          <div className="pt-3">
            {total ? `${pageNum}/${(total / rows).toFixed(0)}` : ""}
          </div>

          <button className="cursor-pointer" onClick={handlepageplus}>
            <div className={PrimeIcons.ARROW_RIGHT}></div>
          </button>

          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Select first N rows"
            className="border-2 rounded-[8px]"
          />

          <Button label="Select" severity="success" onClick={handleRowS} />

          <div>
            <div className="card flex justify-content-center  ">
              <Dropdown
                value={rows}
                onChange={numRow}
                options={num}
                optionLabel="name"
                placeholder="Select number of rows"
                className="w-full md:w-14rem "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
