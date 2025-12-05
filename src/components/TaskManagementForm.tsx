import React, { useState } from "react";
import CustomModal from "./CustomModal";
import {
  createTheme,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
  ThemeProvider,
} from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_PROJECT_USERS, GET_TASK, project } from "../graphql/queries";
import { Add, AddCircle, Cancel } from "@mui/icons-material";

const CHAHNGE_TASK_NAME = gql`
  mutation changeTaskName($id: ID!, $name: String!) {
    changeTaskName(id: $id, name: $name) {
      __typename
      id
      name
    }
  }
`;

const CHAHNGE_TASK_DESCRIPTION = gql`
  mutation changeTaskDescription($id: ID!, $description: String!) {
    changeTaskDescription(id: $id, description: $description) {
      __typename
      id
      description
    }
  }
`;

const CHANGE_TASK_STAGE = gql`
  mutation changeTaskStage($id: ID!, $stageId: ID!) {
    changeTaskStage(id: $id, stageId: $stageId) {
      __typename
      id
      stage {
        __typename
        id
      }
    }
  }
`;

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

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            cursor: "pointer",
            padding: 2,
          },

          "& .MuiOutlinedInput-root": {
            transition: "background-color 0.2s",
            padding: 2,

            "&:hover": {
              backgroundColor: "#f0f0f0",
            },

            "&.Mui-focused": {
              backgroundColor: "transparent",
              borderWidth: 1,
            },

            "& fieldset": {
              borderWidth: "0px",
            },
            "&:hover fieldset": {
              borderWidth: "0px",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "0px",
            },
          },
        },
      },
    },
  },
});

const TaskManagementForm: React.FC<Props> = ({ modalData, setModalData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<any>(null);

  const [assignees, setAssignees] = useState<number[]>([]);

  const { data } = useQuery(GET_PROJECT_USERS, {
    skip: !modalData?.projectId,
    variables: {
      projectId: modalData?.projectId,
    },
  });

  const { refetch, data: taskData } = useQuery(GET_TASK, {
    variables: {
      id: modalData?.taskId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    skip: !modalData?.taskId,
    onCompleted: (data) => {
      const { name, assignees, description, stage } = data?.task ?? {};
      setName(name);
      setDescription(description);
      setStage(stage?.id);
      setAssignees(assignees?.map((user: any) => user?.id) ?? []);
    },
  });

  const [changeTaskName, { loading: changeTaskLoading }] = useMutation(
    CHAHNGE_TASK_NAME,
    {
      onError: () => {
        refetch();
      },
    }
  );

  const [changeTaskDescription, { loading: changeTaskDescriptionLoading }] =
    useMutation(CHAHNGE_TASK_DESCRIPTION, {
      onError: () => {
        refetch();
      },
    });

  const [changeTaskStage, { loading: changeTaskStageLoading }] = useMutation(
    CHANGE_TASK_STAGE,
    {
      onError: () => {
        refetch();
      },
      refetchQueries: [
        { query: project, variables: { id: modalData?.projectId } },
      ],
    }
  );

  const handleCloseModal = () => {
    setModalData((_) => ({
      isOpen: false,
      taskId: null,
    }));
  };

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const [taskStatusMenu, setTaskStatusMenu] = useState<any>(null);

  const handleAddAssignees = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOpenStatusMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTaskStatusMenu(e.currentTarget);
  };

  const handleCloseStatusMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTaskStatusMenu(null);
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

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value ?? "");
  };

  const handleTaskNameBlur = () => {
    if (name.trim().length > 0) {
      if (name != taskData?.task?.name) {
        changeTaskName({
          variables: {
            id: modalData?.taskId,
            name,
          },
        });
      }
    } else {
      setName(taskData?.task?.name);
    }
  };

  const handleTaskDescriptonBlur = () => {
    changeTaskDescription({
      variables: {
        id: modalData?.taskId,
        description,
      },
    });
  };

  const handleChangeTaskStage = (stageId: number) => {
    setStage(stageId);
    setTaskStatusMenu(null);

    if (stageId != taskData?.task?.stage?.id) {
      changeTaskStage({
        variables: {
          id: modalData?.taskId,
          stageId,
        },
      });
    }
  };

  return (
    <CustomModal
      isOpen={modalData.isOpen}
      onClose={handleCloseModal}
      disableBackdropClick={false}
      className="rounded-lg"
      modalSize={"75%"}
    >
      <ThemeProvider theme={theme}>
        <div className="flex flex-col gap-4">
          <TextField
            variant="outlined"
            name={"name"}
            type="text"
            className="capitalize"
            value={name}
            onChange={handleChangeTaskName}
            InputProps={{
              style: {
                fontSize: 24,
                fontWeight: "bold",
              },
            }}
            onBlur={handleTaskNameBlur}
            disabled={changeTaskLoading}
            autoComplete="off"
          />

          <div className="grid grid-cols-2 gap-10">
            <div className="flex items-center gap-10">
              <p className="text-primary-color font-semibold">status</p>
              <IconButton
                style={{
                  fontSize: 16,
                  backgroundColor: data?.project?.stages?.find(
                    (projectStage: any) => projectStage?.id == stage
                  )?.color,
                  borderRadius: 5,
                  fontWeight: "bold",
                  color: "white",
                  paddingBlock: 3,
                }}
                onClick={handleOpenStatusMenu}
              >
                {
                  data?.project?.stages?.find(
                    (projectStage: any) => projectStage?.id == stage
                  )?.name
                }
              </IconButton>
            </div>
          </div>

          <Menu
            open={!!taskStatusMenu}
            anchorEl={taskStatusMenu}
            onClose={handleCloseStatusMenu}
            MenuListProps={{
              style: {
                width: 200,
              },
            }}
          >
            {data?.project?.stages?.map((stage: any) => (
              <MenuItem
                onClick={() => handleChangeTaskStage(+stage?.id)}
                key={stage?.id}
                disabled={changeTaskStageLoading}
                style={{
                  backgroundColor: stage?.color,
                  color: "white",
                  borderRadius: 5,
                  margin: 10,
                }}
              >
                {stage?.name}
              </MenuItem>
            ))}
          </Menu>

          <hr />

          <TextField
            multiline
            rows={5}
            variant="outlined"
            name={"description"}
            type="text"
            className="capitalize"
            value={description}
            onChange={handleChangeDescription}
            disabled={changeTaskDescriptionLoading}
            onBlur={handleTaskDescriptonBlur}
            autoComplete="off"
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
        </div>
      </ThemeProvider>
    </CustomModal>
  );
};

export default TaskManagementForm;
