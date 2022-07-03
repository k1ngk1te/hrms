import {
  FC,
  ChangeEvent,
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons"
import { FaSadTear } from "react-icons/fa";
import Badge from "../../common/Badge";
import Button from "../Button";
import Checkbox from "../Checkbox";
import Input from "../Input";
import Select from "../Select";
import { DotsLoader } from "../Loader";
import Actions from "./Actions";

export type HeadType = {
  style?: CSSProperties;
  type?: "actions";
  value: string;
}[];

export type RowBaseType = {
  options?: any;
  classes?: string;
  Icon?: IconType;
  link?: string;
  type?: "actions" | "badge" | "button" | "icon" | "image" | "switch" | "input" | "select";
  style?: CSSProperties;
  value?: any;
};

export type RowType =
  | RowBaseType[]
  | {
      id: string;
      rows: RowBaseType[];
    };

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

export type GetTickedValuesParamType = "all" | string[];
export type GetTickedValuesType = (Ids: GetTickedValuesParamType) => void;

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
  showTicks?: boolean;
  getTickedValues?: GetTickedValuesType;
};

const NoData = ({ loading }: { loading?: boolean }) => (
  <div className="bg-gray-200 flex flex-col h-[250px] items-center justify-center w-full">    
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
  </div>
);

export type TableContainerProps = {
  children: ReactNode;
  link?: string;
  classes?: string;
  props?: any;
};

export const Container: FC<TableContainerProps> = ({
  children,
  link,
  classes,
  ...props
}) => {
  const defaultClasses =
    "flex items-center justify-center px-2 py-3 w-full " + (classes || "");
  const linkClass = !classes ? " cursor-pointer hover:bg-purple-100 " : "";
  return link ? (
    <Link className={defaultClasses + linkClass} to={link} {...props}>
      {children}
    </Link>
  ) : (
    <div className={defaultClasses} {...props}>
      {children}
    </div>
  );
};

const Table = ({
  heads,
  options,
  loading = false,
  rows,
  split,
  sn,
  showTicks,
  getTickedValues,
  title,
}: TableProps) => {
  const [tickAll, setTickAll] = useState(false);
  const [ticked, setTicked] = useState<string[]>([]);

  const handleTickAll = useCallback(
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      if (showTicks) {
        setTickAll(checked);
        if (!checked) setTicked([]);
      }
    },
    [showTicks, tickAll]
  );

  const handleTickChange = useCallback(
    (id: string, checked: boolean) => {
      if (showTicks) {
        let newState: string[] = [];
        if (checked && !ticked.includes(id)) newState = [...ticked, id];
        else if (!checked && ticked.includes(id))
          newState = ticked.filter((value) => value !== id);

        setTicked(newState);
      }
    },
    [showTicks, ticked]
  );

  useEffect(() => {
    if (showTicks && getTickedValues) getTickedValues(tickAll ? "all" : ticked);
  }, [showTicks, getTickedValues, tickAll, ticked]);

  return (
    <>
      {title && (
        <h4 className="capitalize font-semibold mb-2 text-primary-500 text-sm md:text-base">
          {title}
        </h4>
      )}
      {split && (
        <div
          className={`${
            split.length?.md ? split.length.md : "md:grid-cols-4"
          } ${
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
        <table className="relative table table-auto w-full">
          <thead>
            <tr
              className={`bg-gray-300 font-extrabold rounded-lg text-primary-500 text-sm ${
                options?.heads?.textForm || "uppercase"
              }`}
            >
              {showTicks && (
                <th
                  className="flex items-center justify-center px-2 py-[0.75rem]"
                  style={{ minWidth: "16px", maxWidth: "60px" }}
                >
                  <Checkbox
                    labelStyle={{
                      maxWidth: "60px",
                    }}
                    centered
                    margin=""
                    value={tickAll}
                    onChange={handleTickAll}
                    required={false}
                  />
                </th>
              )}
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
          {loading === false && rows && rows.length > 0 && (
            <tbody>
              {rows.map((data, index) => {
                const isAnArray = Array.isArray(data);

                if (showTicks) {
                  if (isAnArray)
                    throw new Error(
                      "Since showTicks is true, rows must be an object containing an array of RowBaseType Objects and an id key"
                    );
                  else if ("id" in data === false)
                    throw new Error("Value of row must have an id field/key");
                }

                const rowData: RowBaseType[] = isAnArray
                  ? data
                  : "rows" in data
                  ? data.rows
                  : [];
                const rowTicked =
                  tickAll ||
                  (!isAnArray && "id" in data && ticked.includes(data.id));

                return (
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
                    {showTicks && (
                      <td style={{ minWidth: "16px", maxWidth: "60px" }}>
                        <Checkbox
                          labelStyle={{ maxWidth: "60px" }}
                          centered
                          margin=""
                          name={!isAnArray ? data.id : ""}
                          value={rowTicked}
                          onChange={(e) =>
                            !isAnArray
                              ? handleTickChange(data.id, e.target.checked)
                              : undefined
                          }
                          required={false}
                        />
                      </td>
                    )}
                    {sn && (
                      <td
                        className="text-center"
                        style={{ minWidth: "16px", maxWidth: "32px" }}
                      >
                        <Container>{index + 1}</Container>
                      </td>
                    )}
                    {rowData?.map((props, index: number) => {
                      const { style, classes, Icon, type, link, value } = props;
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
                            <Checkbox
                              required={false}
                              {...rowOptions}
                              value={value}
                              key={index}
                            />
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
                              <Badge
                                title={value}
                                {...rowOptions}
                              />
                            </Container>
                          ) : type === "button" ? (
                            <Container classes={classes}>
                              <Button
                                bg="bg-primary-600 hover:bg-primary-400"
                                caps
                                padding="px-4 py-1"
                                title={value}
                                {...rowOptions}
                              />
                            </Container>
                          ) : type === "icon" && Icon ? (
                            <Container classes={classes} link={link}>
                              <Icon {...rowOptions} />
                            </Container>
                          ) : type === "input" ? (
                            <Container classes={classes}>
                              <Input
                                required={false}
                                bdrColor="border-gray-300"
                                value={value}
                                {...rowOptions}
                              />
                            </Container>
                          ) : type === "select" ? (
                            <Container classes={classes}>
                              <Select
                                required={false}
                                bdrColor="border-gray-300"
                                value={value}
                                {...rowOptions}
                              />
                            </Container>
                          ) : (
                            <Container classes={classes} link={link}>
                              {value}
                            </Container>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        {(rows === null || rows === undefined || rows.length <= 0) && (
          <NoData loading={loading || false} />
        )}
      </div>
    </>
  );
};

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
  showTicks: false,
};

export default Table;
