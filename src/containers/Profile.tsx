import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaLock, FaUserEdit } from "react-icons/fa"

import { LEAVES_PAGE_URL } from "@/config/routes";
import { isErrorWithData, isFormError } from "@/store"
import { logout } from "@/store/features/auth-slice";
import {
  open as modalOpen,
  close as modalClose,
} from "@/store/features/modal-slice";
import {
  useGetProfileQuery,
  useChangePasswordMutation,
} from "@/store/features/auth-api-slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getDate, toCapitalize } from "@/utils";
import { ChangePasswordForm } from "@/components/Employees";
import { UpdateForm } from "@/components/Profile";
import { Container, InfoComp, InfoTopBar, Modal } from "@/components/common";

const Profile = () => {
  const [formType, setFormType] = useState<"profile" | "password">("profile");

  const dispatch = useAppDispatch();
  const modalVisible = useAppSelector((state) => state.modal.visible);

  const getData = useGetProfileQuery();
  const empData = getData.data;

  const [changePassword, { error, status, isLoading }] =
    useChangePasswordMutation();

  const handlePasswordChange = useCallback(
    (form: { password1: string; password2: string }) => {
      changePassword(form);
    },
    [changePassword]
  );

  useEffect(() => {
    const changeErrorStatus =
      isErrorWithData(error) && error?.status === 401;
    const errorStatus =
      isErrorWithData(getData.error) &&
      getData.error.status === 401;
    if (changeErrorStatus === true || errorStatus === true) dispatch(logout());
  }, [dispatch, getData.error, error]);

  return (
    <Container
      heading="My Profile"
      refresh={{
        loading: getData?.isFetching,
        onClick: () => getData?.refetch(),
      }}
      loading={getData.isLoading}
    >
      <InfoTopBar
        email={empData?.user?.email}
        full_name={toCapitalize(
          `${empData?.user?.first_name} ${empData?.user?.last_name}`
        )}
        image={empData?.profile?.image || "/static/images/default.png"}
        actions={[
          {
            IconLeft: FaUserEdit,
            onClick: () => {
              formType !== "profile" && setFormType("profile");
              dispatch(modalOpen());
            },
            title: "Edit Profile",
          },
          {
            bg: "bg-gray-600 hover:bg-gray-500",
            IconLeft: FaLock,
            onClick: () => {
              formType !== "password" && setFormType("password");
              dispatch(modalOpen());
            },
            title: "Change Password",
          },
          {
            bg: "bg-yellow-600 hover:bg-yellow-500",
            IconLeft: FaCheckCircle,
            title: "Request Leave",
            link: LEAVES_PAGE_URL,
          },
        ]}
      />
      <InfoComp
        infos={[
          {
            title: "First Name",
            value: toCapitalize(empData?.user?.first_name) || "",
          },
          {
            title: "Last Name",
            value: toCapitalize(empData?.user?.last_name) || "",
          },
          { title: "E-mail", value: empData?.user?.email || "" },
          {
            title: "Birthday",
            value: getDate(empData?.profile?.date_of_birth, true) as string,
          },
          {
            title: "Gender",
            value: toCapitalize(empData?.profile?.gender?.name) || "",
          },
          {
            title: "Status",
            value: empData?.status || "inactive",
            type: "badge",
            options: {
              bg:
                empData?.status === "active"
                  ? "success"
                  : empData?.status === "on leave"
                  ? "warning"
                  : "error",
            },
          },
        ]}
        title="Personal Information"
      />
      <InfoComp
        infos={[
          { title: "E-mail", value: empData?.user?.email || "" },
          { title: "Mobile", value: empData?.profile?.phone || "" },
          { title: "Address", value: empData?.profile?.address || "" },
          {
            title: "State",
            value: toCapitalize(empData?.profile?.state) || "",
          },
          { title: "City", value: toCapitalize(empData?.profile?.city) || "" },
        ]}
        title="contact information"
      />
      <InfoComp
        infos={[
          {
            title: "Job Title",
            value: toCapitalize(empData?.job?.name) || "-------",
          },
          {
            title: "Department",
            value: toCapitalize(empData?.department?.name) || "",
          },
          {
            title: "Last Leave Date",
            value: empData?.profile?.last_leave_info
              ? `${getDate(
                  empData?.profile?.last_leave_info?.start_date,
                  true
                )} - ${getDate(
                  empData?.profile?.last_leave_info?.end_date,
                  true
                )}`
              : "-------",
          },
          {
            title: "Length Of Leave",
            value: empData?.profile?.last_leave_info?.no_of_days
              ? `${empData.profile.last_leave_info.no_of_days} ${
                  empData.profile.last_leave_info.no_of_days > 1
                    ? "days"
                    : "day"
                }`
              : "------",
          },
          {
            title: "Date Employed",
            value: empData?.date_employed
              ? (getDate(empData?.date_employed, true) as string)
              : "----",
          },
        ]}
        title="Additional information"
        titleWidth="w-[170px]"
      />
      <Modal
        close={() => dispatch(modalClose())}
        component={
          formType === "profile" ? (
            <UpdateForm initState={empData} />
          ) : formType === "password" ? (
            <ChangePasswordForm
              errors={isFormError<{new_password1?: string; new_password2?: string}>(error) ? error.data : undefined}
              errorStatus={isErrorWithData(error) ? error.status : undefined}
              onSubmit={handlePasswordChange}
              isLoading={isLoading}
              success={status === "fulfilled"}
            />
          ) : (
            <></>
          )
        }
        description={
          formType === "password"
            ? "Fill in the form to change your password"
            : "Fill in the form to update your profile"
        }
        keepVisible
        title={
          formType === "password"
            ? "Change Password"
            : "Update profile Information"
        }
        visible={modalVisible}
      />
    </Container>
  );
};

export default Profile;
