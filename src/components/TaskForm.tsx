import React, { useState } from "react";
import CustomModal from "./CustomModal";
import TextInput from "../inputs/TextInput";
import ValidateAt from "../enums/ValidateAt";
import {
  createTheme,
  IconButton,
  Input,
  TextareaAutosize,
  TextField,
  Theme,
  Popover,
  Menu,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TASK, upsertTask } from "../graphql/mutations";
import { GET_PROJECT_USERS, project } from "../graphql/queries";
import { useFormik } from "formik";
import { Add, PlusOne } from "@mui/icons-material";

interface Props {
  modalData: {
    isOpen: boolean;
    projectId?: number | null;
    stageId?: number | null;
  };
  setModalData: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      projectId?: number | null;
      stageId?: number | null;
    }>
  >;
  formData: { id?: number | null; name: string; userIds: string[] };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      id?: number | null;
      name: string;
      userIds: string[];
    }>
  >;
  clientErrors: string[];
  setClientErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Values {
  name: string;
  description: string;
  userIds: number[];
}

const TaskForm: React.FC<Props> = ({
  modalData,
  setModalData,
  formData,
  setFormData,
  clientErrors,
  setClientErrors,
}) => {
  const { handleSubmit, errors, values, handleChange, setValues } = useFormik({
    initialValues: {
      name: "",
      description: "",
      userIds: [],
    },
    onSubmit: (values: Values) => {
      console.log("values", values);
    },
  });

  console.log("modalData", modalData);

  const { data } = useQuery(GET_PROJECT_USERS, {
    skip: !modalData?.projectId,
    variables: {
      projectId: modalData?.projectId,
    },
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [attemptUpsertTask] = useMutation(upsertTask, {
    variables: {
      input: {
        name: formData.name,
        projectId: modalData.projectId,
        stageId: modalData.stageId,
        usersIds: [],
      },
    },
    onCompleted: (_) => {
      handleCloseModal();
    },
    refetchQueries: [
      { query: project, variables: { id: modalData.projectId } },
    ],
  });

  const [attemptUpdateTask] = useMutation(UPDATE_TASK, {
    variables: {
      input: {
        id: formData?.id,
        name: formData?.name,
        usersIds: formData?.userIds,
      },
    },
    onCompleted: () => {
      handleCloseModal();
    },
  });

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
    setModalData((_) => ({
      isOpen: false,
      projectId: null,
      stageId: null,
    }));

    setFormData({ name: "", userIds: [] });
  };

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleAddAssignees = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAddOrRemoveUser = (userId: number) => {
    if (values.userIds.includes(userId)) {
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
        />

        <div className="flex items-center gap-5">
          <p>assign to</p>
          <div className="border flex items-center gap-2 px-2 rounded-md">
            <div className="flex items-center gap-1">
              {data?.project?.users
                ?.filter((user: any) => values.userIds.includes(+user.id))
                .map((user: any) => (
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
          {data?.project?.users
            ?.filter((user: any) => !values.userIds.includes(+user?.id))
            ?.map((user: any) => (
              <MenuItem
                onClick={() => handleAddOrRemoveUser(+user.id)}
                key={user.id}
              >
                {user.name}
              </MenuItem>
            ))}
        </Menu>

        <IconButton
          type="submit"
          sx={{
            fontSize: 18,
            textTransform: "capitalize",
            backgroundColor: "#61677A",
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
