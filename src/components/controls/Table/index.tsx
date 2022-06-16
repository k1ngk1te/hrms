import { FC, CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaSadTear } from "react-icons/fa";
import Badge from "../../common/Badge";
import Checkbox from "../Checkbox";
import { DotsLoader } from "../Loader";
import Actions from "./Actions";

export type HeadType = {
  style?: CSSProperties;
  type?: "actions";
  value: string;
}[];

export type RowType = {
  options?: any;
  classes?: string;
  link?: string;
  type?: "actions" | "badge" | "image" | "switch";
  style?: CSSProperties;
  value?: any;
}[];

export type TableOptionsProps = {
  heads?: {
    sticky?: boolean;
    textForm?: "capitalize" | "uppercase" | "normal";
  };
  maxHeight?: string;
  rows?: {
    bold?: boolean;
    center?: boolean;
    hoverDefault?: boolean;
    hoverClasses?: string;
    textForm?: "capitalize" | "uppercase" | "normal";
  };
};

export type TableProps = {
  heads: HeadType;
  options?: TableOptionsProps;
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
            <FaSadTear
              className="leading-[0px] inline-block text-gray-400"
              style={{
                fontSize: "120px",
              }}
            />
            <p className="font-semibold mt-2 text-center text-gray-500 text-base md:text-lg">
              There is currently no data on this table.
            </p>
          </>
        )}
      </td>
    </tr>
  </tbody>
);

export type TableContainerProps = {
  children: ReactNode;
  link?: string;
  classes?: string;
  props?: any
}

export const Container: FC<TableContainerProps> = ({ children, link, classes, ...props }) => {
  const defaultClasses = "flex items-center justify-center px-2 py-3 w-full " + (classes || "")
  const linkClass = !classes ? " cursor-pointer hover:bg-purple-100 " : ""
  return link ? (
    <Link className={defaultClasses + linkClass} to={link} {...props}>
      {children}
    </Link>
  ) : (
    <div className={defaultClasses} {...props}>{children}</div>
  );
};

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
              } cursor-pointer flex font-primary font-bold items-center justify-center px-4 py-2 text-center text-sm uppercase w-full hover:bg-gray-200 hover:text-primary-500
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
                className={`font-primary ${
                  options?.rows?.bold ? "font-bold" : "font-normal"
                } leading-5 text-gray-600 text-sm ${
                  options?.rows?.textForm || "uppercase"
                } ${
                  options?.rows?.hoverDefault
                    ? "hover:bg-gray-100 hover:even:bg-gray-300 cursor-pointer"
                    : options?.rows?.hoverClasses || ""
                } bg-white even:bg-gray-200`}
              >
                {sn && (
                  <td
                    className="text-center"
                    style={{ minWidth: "16px", maxWidth: "32px" }}
                  >
                    <Container>
                      {index + 1}
                    </Container>
                  </td>
                )}
                {data?.map((props, index: number) => {
                  const { style, classes, type, link, value } = props;
                  const rowOptions = props?.options || {};

                  return type === "actions" ? (
                    <Actions key={index + 1} actions={value} />
                  ) : type === "image" ? (
                    <td
                      key={index + 1}
                      className="flex items-center justify-center relative"
                    >
                      <Container link={link}>
                        <div
                          style={{
                            height: "30px",
                            width: "30px",
                            ...style,
                          }}
                        >
                          <img {...value} />
                        </div>
                      </Container>
                    </td>
                  ) : type === "switch" ? (
                    <td
                      key={index + 1}
                      className="text-center"
                      style={style}
                    >
                      <Container>
                        <Checkbox {...rowOptions} value={value} key={index} />
                      </Container>
                    </td>
                  ) : (
                    <td
                      key={index + 1}
                      className={`${
                        type === "badge"
                          ? "text-center"
                          : options?.rows?.center === false || undefined
                          ? "text-left"
                          : "text-center"
                      }`}
                      style={{
                        minWidth: type === "badge" ? "130px" : "",
                        ...style,
                      }}
                    >
                      {type === "badge" ? (
                        <Container classes={classes} link={link}>
                          <Badge title={value} {...rowOptions} key={index} />
                        </Container>
                      ) : (
                        <Container classes={classes} link={link}>{value}</Container>
                      )}
                    </td>
                  );
                })}
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

export const defaultOptions: TableOptionsProps = {
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
};

Table.defaultProps = {
  options: defaultOptions,
  loading: false,
  sn: true,
};

export default Table;

