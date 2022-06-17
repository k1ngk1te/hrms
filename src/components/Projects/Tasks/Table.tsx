import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom"
import { PROJECT_TASK_PAGE_URL } from "../../../config";
import { TaskType, TaskFormInitStateType } from "../../../types/employees";
import Table, { HeadType, RowType } from "../../controls/Table";

const heads: HeadType = [
  { value: "name" },
  { value: "due date" },
  { value: "status" },
  { type: "actions", value: "actions" },
];

const getRows = (
  data: TaskType[],
  onEdit: (id: string, initState: TaskFormInitStateType) => void,
  onDelete: (id: string) => void,
  loading: boolean,
  project_id?: string,
): RowType[] =>
  data.map((task) => [
    { link: PROJECT_TASK_PAGE_URL(task.id), value: task.name || "---" },
    { value: task.due_date ? new Date(task.due_date).toLocaleDateString() : "---"},
    {
      options: {
        bg:
          task.completed
            ? "success"
            : "error"
      },
      type: "badge",
      value: task.completed ? "completed" : "ongoing",
    },
    {
      type: "actions",
      value: [
        {
          disabled: loading,
          color: "primary",
          Icon: FaEye,
          link: project_id ? PROJECT_TASK_PAGE_URL(project_id, task.id) : "#",
        },
        {
          disabled: loading,
          color: "primary",
          Icon: FaPen,
          onClick: () => onEdit(task.id, {
            name: task.name,
            description: task.description,
            priority: task.priority,
            due_date: task.due_date,
            leaders: task.leaders.map(leader => leader.id),
            followers: task.followers.map(team => team.id)
          })
        },
        {
          disabled: loading,
          color: "danger",
          Icon: FaTrash,
          onClick: () => onDelete(task.id)
        },
      ],
    },
  ]);

type TableType = {
  tasks: TaskType[];
  deleteLoading: boolean;
  onEdit: (id: string, initState: TaskFormInitStateType) => void;
  onDelete: (id: string) => void;
};

const TaskTable = ({ tasks, deleteLoading, onEdit, onDelete }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<"" | "completed" | "ongoing">("");

  const { id } = useParams()

  useEffect(() => {
    let finalList;
    if (activeRow === "completed") {
      finalList = tasks.filter(
        (task) => task.completed === true
      );
    } else if (activeRow === "ongoing") {
      finalList = tasks.filter((task) => task.completed === false);
    } else {
      finalList = tasks;
    }
    setRows(getRows(finalList, onEdit, onDelete,deleteLoading, id));
  }, [activeRow, tasks]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table
        heads={heads}
        rows={rows}
        split={{
          actions: [
            {
              active: activeRow === "",
              onClick: () => {
                setRows(getRows(tasks, onEdit, onDelete, deleteLoading, id));
                setActiveRow("");
              },
              title: "all",
            },
            {
              active: activeRow === "completed",
              onClick: () => {
                setRows(
                  getRows(tasks, onEdit, onDelete, deleteLoading, id).filter(
                    (row: RowType) => row[2].value === "completed" && row
                  )
                );
                setActiveRow("completed");
              },
              title: "completed",
            },
            {
              active: activeRow === "ongoing",
              onClick: () => {
                setRows(
                  getRows(tasks, onEdit, onDelete, deleteLoading, id).filter(
                    (row: RowType) => row[2].value === "ongoing" && row
                  )
                );
                setActiveRow("ongoing");
              },
              title: "ongoing",
            },
          ],
        }}
      />
    </div>
  );
};

export default TaskTable;
