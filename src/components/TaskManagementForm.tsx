import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import TextInput from "../inputs/TextInput";
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
  Tooltip,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TASK, upsertTask } from "../graphql/mutations";
import { GET_PROJECT_USERS, GET_TASK, project } from "../graphql/queries";
import { useFormik } from "formik";
import { Add, AddCircle, Cancel, Close, PlusOne } from "@mui/icons-material";
import * as Yup from "yup";

const CreateTaskSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required"),
  description: Yup.string().required("Description is required"),
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

const TaskManagementForm: React.FC<Props> = ({ modalData, setModalData }) => {
  const [name, setName] = useState("");
  const [assignees, setAssignees] = useState<number[]>([]);

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
      const { name, assignees } = data?.task ?? {};
      setName(name);
      setAssignees(assignees?.map((user: any) => user?.id) ?? []);
    },
  });

  const handleCloseModal = () => {
    setModalData((_) => ({
      isOpen: false,
      taskId: null,
    }));
  };

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleAddAssignees = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAddOrRemoveUser = (userId: number) => {
    if (assignees?.map(Number).includes(+userId)) {
      setAssignees((prev: any) => prev?.filter((id: any) => id != userId));
    } else {
      setAssignees((prev: any) => [...prev, userId]);
      setAnchorEl(null);
    }
  };

  const handleRemoveAssignee = (userId: number) => {
    setAssignees((prev) => prev?.filter((id) => id != userId));
  };

  const selectedUsers = data?.project?.users?.filter((user: any) =>
    assignees?.map(Number).includes(+user?.id)
  );

  const handleChangeTaskName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value ?? "");
  };

  return (
    <CustomModal
      isOpen={modalData.isOpen}
      modalTitle="Task"
      onClose={handleCloseModal}
      disableBackdropClick={false}
    >
      <TextField
        label="name"
        variant="outlined"
        name={"name"}
        type="text"
        margin="normal"
        className="capitalize"
        value={name}
        onChange={handleChangeTaskName}
      />

      <TextField
        multiline
        rows={5}
        label="description"
        variant="outlined"
        name={"description"}
        type="text"
        margin="normal"
        className="capitalize"
      />

      <div className="flex items-center gap-5">
        <p>assign to</p>
        <div className="border flex items-center gap-2 px-2 rounded-md">
          <div className="flex items-center gap-1">
            {selectedUsers?.map((user: any) => (
              <Tooltip title={user?.name} key={user?.id}>
                <IconButton
                  key={user.id}
                  className="w-[25px] h-[25px] bg-gray-500 text-white rounded-full flex items-center justify-center m-1 text-[10px] capitalize absolute"
                  onClick={() => handleRemoveAssignee(user?.id)}
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    fontSize: 15,
                  }}
                >
                  {user.name?.[0]}

                  <Cancel
                    className="group-hover:block absolute bottom-[-3px] right-[-3px] bg-white rounded-full"
                    style={{ fontSize: 14 }}
                    color="error"
                  />
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
        {data?.project?.users?.map((user: any) => (
          <MenuItem
            onClick={() => handleAddOrRemoveUser(+user.id)}
            key={user.id}
          >
            <span
              key={user.id}
              className="group w-[25px] h-[25px] bg-gray-500 text-white rounded-full flex items-center justify-center me-3 text-[10px] capitalize relative"
              onClick={() => handleRemoveAssignee(user?.id)}
              style={{
                backgroundColor: "grey",
                color: "white",
                fontSize: 15,
              }}
            >
              {user.name?.[0]}

              {assignees?.map(Number).includes(+user?.id) ? (
                <Cancel
                  className="group-hover:block absolute bottom-[-3px] right-[-3px] bg-white rounded-full"
                  style={{ fontSize: 14 }}
                  color="error"
                />
              ) : (
                <AddCircle
                  className="group-hover:block absolute bottom-[-3px] right-[-3px] bg-white rounded-full"
                  style={{ fontSize: 14 }}
                  color="info"
                />
              )}
            </span>
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </CustomModal>
  );
};

export default TaskManagementForm;
