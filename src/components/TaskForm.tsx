import React, { useState } from "react";
import CustomModal from "./CustomModal";
import { IconButton, TextField, Menu, MenuItem, Tooltip } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { upsertTask } from "../graphql/mutations";
import { GET_PROJECT_USERS, GET_TASK, project } from "../graphql/queries";
import { useFormik } from "formik";
import { Add } from "@mui/icons-material";
import * as Yup from "yup";

const CreateTaskSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required"),
  description: Yup.string(),
  userIds: Yup.array().of(Yup.number()),
});

interface Props {
  modalData: {
    isOpen: boolean;
    projectId?: number | null;
    stageId?: number | null;
    taskId?: number | null;
  };
  setModalData: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      projectId?: number | null;
      stageId?: number | null;
    }>
  >;
}

interface Values {
  id?: number;
  name: string;
  description: string;
  userIds: number[];
}

const TaskForm: React.FC<Props> = ({ modalData, setModalData }) => {
  const { handleSubmit, errors, values, handleChange, setValues, touched } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
        userIds: [],
      },
      validationSchema: CreateTaskSchema,
      onSubmit: (values: Values) => {
        attemptUpsertTask({
          variables: {
            input: {
              name: values?.name,
              projectId: modalData?.projectId,
              stageId: modalData?.stageId,
              description: values?.description,
              usersIds: values?.userIds ?? [],
            },
          },
        });
      },
    });

  const { data } = useQuery(GET_PROJECT_USERS, {
    skip: !modalData?.projectId,
    variables: {
      projectId: modalData?.projectId,
    },
  });

  useQuery(GET_TASK, {
    variables: {
      id: modalData?.taskId,
    },
    skip: !modalData?.taskId,
    onCompleted: (data) => {
      const { id, name, assignees } = data?.task ?? {};

      setValues({
        id,
        name,
        description: data?.task?.description || "",
        userIds: assignees?.map((assignee: any) => assignee?.id) || [],
      });
    },
  });

  const [attemptUpsertTask] = useMutation(upsertTask, {
    onCompleted: () => {
      handleCloseModal();
    },
    refetchQueries: [
      { query: project, variables: { id: modalData.projectId } },
    ],
  });

  // const [attemptUpdateTask] = useMutation(UPDATE_TASK, {
  //   variables: {
  //     input: {
  //       id: formData?.id,
  //       name: formData?.name,
  //       usersIds: formData?.userIds,
  //     },
  //   },
  //   onCompleted: () => {
  //     handleCloseModal();
  //   },
  // });

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsFormSubmitted(true);

  //   if (clientErrors.length) return;

  //   if (formData?.id) {
  //     attemptUpdateTask();
  //   } else {
  //     attemptUpsertTask();
  //   }
  // };

  const handleCloseModal = () => {
    setModalData(() => ({
      isOpen: false,
      projectId: null,
      stageId: null,
    }));
  };

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleAddAssignees = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAddOrRemoveUser = (userId: number) => {
    if (values.userIds?.map(Number).includes(+userId)) {
      setValues((prev: any) => ({
        ...prev,
        userIds: prev.userIds.filter((id: any) => id != userId),
      }));
    } else {
      setValues((prev: any) => ({
        ...prev,
        userIds: [...prev.userIds, userId],
      }));
    }
  };

  const handleRemoveAssignee = (userId: number) => {
    setValues((prev) => ({
      ...prev,
      userIds: prev.userIds.filter((id) => id != userId),
    }));
  };

  const selectedUsers = data?.project?.users?.filter((user: any) =>
    values.userIds?.map(Number).includes(+user?.id),
  );

  const availableAssignees = data?.project?.users?.filter(
    (user: any) => !values.userIds?.map(Number).includes(+user?.id),
  );

  console.log("ss", values, data?.project?.users);

  return (
    <CustomModal
      isOpen={modalData.isOpen}
      modalTitle="Task"
      onClose={handleCloseModal}
      disableBackdropClick={false}
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <TextField
          label="name"
          variant="outlined"
          name={"name"}
          value={values.name}
          onChange={handleChange}
          type="text"
          margin="normal"
          className="capitalize"
          error={!!(errors?.name && touched?.name)}
          helperText={touched?.name && errors?.name}
        />

        <TextField
          multiline
          rows={5}
          label="description"
          variant="outlined"
          name={"description"}
          value={values.description}
          onChange={handleChange}
          type="text"
          margin="normal"
          className="capitalize"
          error={!!(errors?.description && touched?.description)}
          helperText={touched?.description && errors?.description}
        />

        <div className="flex items-center gap-5">
          <p>assign to</p>
          <div className="border flex items-center gap-2 px-2 rounded-md">
            <div className="flex items-center gap-1">
              {selectedUsers?.map((user: any) => (
                <Tooltip title={user?.name} key={user?.id}>
                  <IconButton
                    key={user.id}
                    className="w-[25px] h-[25px] bg-gray-500 text-white rounded-full flex items-center justify-center m-1 text-[10px] capitalize"
                    onClick={() => handleRemoveAssignee(user?.id)}
                    style={{
                      backgroundColor: "grey",
                      color: "white",
                      fontSize: 15,
                    }}
                  >
                    {user.name?.[0]}
                  </IconButton>
                </Tooltip>
              ))}
            </div>

            <IconButton onClick={handleAddAssignees}>
              <Add />
            </IconButton>
          </div>
        </div>

        <Menu
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          MenuListProps={{
            style: {
              width: 200,
            },
          }}
        >
          {availableAssignees?.map((user: any) => (
            <MenuItem
              onClick={() => handleAddOrRemoveUser(+user.id)}
              key={user.id}
            >
              <span
                key={user.id}
                className="min-w-[25px] min-h-[25px] w-[25px] h-[25px] bg-gray-500 text-white rounded-full flex items-center justify-center me-3 text-[10px] capitalize"
                onClick={() => handleRemoveAssignee(user?.id)}
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  fontSize: 15,
                }}
              >
                {user.name?.[0]}
              </span>
              {user.name}
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          type="submit"
          sx={{
            fontSize: 18,
            textTransform: "capitalize",
            backgroundColor: "#1F2937",
            color: "#fff",
            height: 30,
            width: 100,
            borderRadius: 1,
            marginTop: 2,
            alignSelf: "flex-end",
            ":hover": {
              backgroundColor: "#6E7486",
            },
          }}
        >
          save
        </IconButton>
      </form>
    </CustomModal>
  );
};

export default TaskForm;
