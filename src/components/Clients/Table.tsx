import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { CLIENT_PAGE_URL } from "../../config";
import { ClientType } from "../../types/employees";
import Table, { HeadType, RowType } from "../controls/Table";

const heads: HeadType = [
  { value: "company name" },
  { value: "client id"},
  { value: "contact person" },
  { value: "email" },
  { value: "phone" },
  { value: "status" },
  { type: "actions", value: "view" },
];

const getRows = (data: ClientType[]): RowType[] =>
  data.map((client) => [
    { link: CLIENT_PAGE_URL(client.id), value: client.company || "---" },
    { value: client.id || "---" },
    { value: client.contact.full_name || "---" },
    { value: client.contact.email || "---" },
    { value: client.contact.profile.phone || "---" },
    {
      options: {
        bg:
          client.contact.active
            ? "success"
            : "error",
      },
      type: "badge",
      value: client.contact.active ? "active" : "inactive",
    },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaEye,
          link: CLIENT_PAGE_URL(client.id),
        },
      ],
    },
  ]);

type TableType = {
  clients: ClientType[];
};

const ClientTable = ({ clients }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<"all" | "active" | "inactive">(
    "all"
  );

  useEffect(() => {
    let finalList;
    if (activeRow === "active") {
      finalList = clients.filter((client) => client.contact.active === true);
    } else if (activeRow === "inactive") {
      finalList = clients.filter((client) => client.contact.active === false);
    } else {
      finalList = clients;
    }
    setRows(getRows(finalList));
  }, [activeRow, clients]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table
        heads={heads}
        rows={rows}
        split={{
          actions: [
            {
              active: activeRow === "all",
              onClick: () => {
                setRows(getRows(clients));
                setActiveRow("all");
              },
              title: "all",
            },
            {
              active: activeRow === "active",
              onClick: () => {
                setRows(
                  getRows(clients).filter(
                    (row: RowType) => row[5].value === "active" && row
                  )
                );
                setActiveRow("active");
              },
              title: "active",
            },
            {
              active: activeRow === "inactive",
              onClick: () => {
                setRows(
                  getRows(clients).filter(
                    (row: RowType) => row[5].value === "inactive" && row
                  )
                );
                setActiveRow("inactive");
              },
              title: "inactive",
            },
          ],
        }}
      />
    </div>
  );
};

export default ClientTable;
