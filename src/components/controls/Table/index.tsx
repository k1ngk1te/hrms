import { FaSadTear } from "react-icons/fa";
import Badge from "../../common/Badge";
import Checkbox from "../Checkbox";
import { DotsLoader } from "../Loader";
import Actions from "./Actions";

export type HeadType = {
  style?: object;
  type?: "actions";
  value: string;
}[];

export type RowType = {
  options?: any;
  type?: "actions" | "badge" | "image" | "switch";
  style?: any;
  value?: any;
}[];

type TableProps = {
  heads: HeadType;
  options?: {
    heads?: {
      sticky?: boolean;
      textForm?: "capitalize" | "uppercase" | "normal";
    };
    maxHeight?: string;
    rows?: {
      bold?: boolean;
      center?: boolean;
      textForm?: "capitalize" | "uppercase" | "normal";
    };
  };
  loading?: boolean;
  rows: RowType[];
  split?: {
    actions: {
      active: boolean;
      onClick: () => void;
      title: string;
    }[];
    length?: {
      md?: string;
      lg?: string;
    };
  };
  sn?: boolean;
  title?: string;
};

const NoData = ({ loading }: { loading?: boolean }) => (
  <tbody className="absolute bg-gray-200 flex flex-col h-full items-center justify-center left-0 top-8 w-full">
    <tr>
      <td className="flex flex-col items-center">
        {loading ? (
          <DotsLoader color="info" />
        ) : (
          <>
            <FaSadTear className="leading-[0px] inline-block text-gray-400" style={{
              fontSize: "120px"
            }} />
            <p className="font-semibold mt-2 text-center text-gray-500 text-base md:text-lg">
              There is currently no data on this table.
            </p>
          </>
        )}
      </td>
    </tr>
  </tbody>
);

const Table = ({
  heads,
  options,
  loading = false,
  rows,
  split,
  sn,
  title,
}: TableProps) => (
  <>
    {title && (
      <h4 className="capitalize font-semibold mb-2 text-primary-500 text-sm md:text-base">
        {title}
      </h4>
    )}
    {split && (
      <div
        className={`${split.length?.md ? split.length.md : "md:grid-cols-4"} ${
          split.length?.lg ? split.length.lg : "lg:grid-cols-6"
        } grid grid-cols-2 mt-1 w-full`}
      >
        {split.actions.map(({ active, onClick, title }) => (
          <div
            key={title}
            onClick={onClick}
            className={`
							${
                active
                  ? "bg-gray-200 text-primary-500"
                  : "bg-gray-100 text-gray-400"
              } cursor-pointer flex font-calibri font-bold items-center justify-center px-4 py-2 text-center text-sm uppercase w-full hover:bg-gray-200 hover:text-primary-500
						`}
          >
            <p className="text-center">{title}</p>
          </div>
        ))}
      </div>
    )}
    <div
      className={`bg-white overflow-x-scroll relative rounded w-full ${
        rows.length <= 0 ? "overflow-y-hidden" : ""
      }`}
      style={{
        maxHeight: options?.maxHeight,
      }}
    >
      <table
        className={`${
          rows.length <= 0 || loading ? "h-[250px]" : ""
        } relative table table-auto w-full`}
      >
        <thead>
          <tr
            className={`bg-gray-300 font-extrabold rounded-lg text-primary-500 text-sm ${
              options?.heads?.textForm || "uppercase"
            }`}
          >
            {sn && (
              <th
                className={`bg-gray-300 font-semibold py-2 text-center ${
                  options?.heads?.sticky ? "sticky top-0 z-10" : ""
                }`}
                style={{ minWidth: "16px", maxWidth: "32px" }}
              >
                S/N
              </th>
            )}
            {heads?.map(({ style, type, value }) => (
              <th
                key={value}
                className={`bg-gray-300 font-semibold py-2 text-center ${
                  options?.heads?.sticky ? "sticky top-0 z-10" : ""
                }`}
                style={{
                  minWidth:
                    value?.length > 10
                      ? "130px"
                      : value?.length > 8
                      ? "100px"
                      : "70px",
                  maxWidth: type === "actions" ? "160px" : "",
                  ...style,
                }}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <NoData loading={loading} />
        ) : rows && rows.length > 0 ? (
          <tbody>
            {rows.map((data, index) => (
              <tr
                key={index + 1}
                className={`font-calibri ${
                  options?.rows?.bold ? "font-bold" : "font-normal"
                } leading-5 text-gray-700 text-sm ${
                  options?.rows?.textForm || "uppercase"
                } even:bg-gray-200`}
              >
                {sn && (
                  <td
                    className="p-2 text-center text-gray-500"
                    style={{ minWidth: "16px", maxWidth: "32px" }}
                  >
                    {index + 1}
                  </td>
                )}
                {data?.map(({ options, style, type, value }, index: number) =>
                  type === "actions" ? (
                    <Actions key={index + 1} actions={value} />
                  ) : type === "image" ? (
                    <td
                      key={index + 1}
                      className="flex items-center justify-center relative"
                    >
                      <div
                        style={{
                          height: "75px",
                          width: "75px",
                          ...style,
                        }}
                      >
                        <img {...value} />
                      </div>
                    </td>
                  ) : type === "switch" ? (
                    <td
                      key={index + 1}
                      className="py-2 text-center text-gray-600"
                      style={style}
                    >
                      <Checkbox {...options} value={value} key={index} />
                    </td>
                  ) : (
                    <td
                      key={index + 1}
                      className={`p-2 ${
                        type === "badge"
                          ? "text-center"
                          : options?.rows?.center === false || undefined
                          ? "text-left"
                          : "text-center"
                      } text-gray-600`}
                      style={{
                        minWidth: type === "badge" ? "130px" : "",
                        ...style,
                      }}
                    >
                      {type === "badge" ? (
                        <Badge title={value} {...options} key={index} />
                      ) : (
                        value
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        ) : (
          <NoData />
        )}
      </table>
    </div>
  </>
);

Table.defaultProps = {
  options: {
    heads: {
      sticky: true,
      textForm: "uppercase",
    },
    maxHeight: "30.2rem",
    rows: {
      bold: true,
      center: true,
      textForm: "uppercase",
    },
  },
  loading: false,
  sn: true,
};

export default Table;
