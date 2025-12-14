import {
  Add,
  AddCircle,
  Cancel,
  DeleteForever,
  MoreVert,
} from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useState } from "react";
import {
  ASSIGN_USER_TO_TASK,
  DELETE_TASK,
  UNASSIGN_USER_FROM_TASK,
} from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { project } from "../graphql/queries";
import Swal from "sweetalert2";

interface assignee {
  id: number;
  name: string;
}
interface Task {
  id: number;
  name: string;
  assignees: assignee[];
  thumbnail: {
    path: string;
  };
  description: string;
}

interface Props {
  task: Task;
  projectId: number;
  projectUsers?: { id: number; name: string }[];
}

const TaskCard: React.FC<Props> = ({ task, projectId, projectUsers }) => {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [taskMenu, setTaskMenu] = useState<any>(null);

  console.log("task", task);

  const handleAddAssignees = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: project, variables: { id: projectId } }],
  });

  const [assignUserToTasl] = useMutation(ASSIGN_USER_TO_TASK, {
    onError: () => {},

    refetchQueries: [{ query: project, variables: { id: projectId } }],
  });

  const [unAssignUserFromTask] = useMutation(UNASSIGN_USER_FROM_TASK, {
    onError: () => {},

    refetchQueries: [{ query: project, variables: { id: projectId } }],
  });

  const handleAddOrRemoveUser = (userId: number) => {
    if (
      task?.assignees
        ?.map((assignee: assignee) => assignee?.id)
        .includes(+userId)
    ) {
      unAssignUserFromTask({
        variables: {
          taskId: task?.id,
          userId,
        },
      });
    } else {
      setAnchorEl(null);
      assignUserToTasl({
        variables: {
          taskId: task?.id,
          userId,
        },
      });
    }
  };

  const handleRemoveAssignee = (userId: number) => {
    unAssignUserFromTask({
      variables: {
        taskId: task?.id,
        userId,
      },
    });
  };

  const handleOpenTaskMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setTaskMenu(e.currentTarget);
  };

  const handleCloseTaskMenu = () => {
    setTaskMenu(null);
  };

  const handleDeleteTask = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        deleteTask({
          variables: {
            id: task?.id,
          },
        });
      }
    });
  };

  return (
    <div className="text-sm relative task-card my-2 rounded overflow-hidden group">
      <img
        className="w-100 cursor-pointer mb-2"
        src={`http://localhost:5000${task?.thumbnail?.path}`}
      />

      <div className="min-h-[100px] p-2">
        <div
          className="bg-white absolute top-1 right-2 rounded hidden group-hover:block task-card-actions-shadow"
          style={{
            ...(!!taskMenu
              ? {
                  display: "block",
                }
              : {}),
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleOpenTaskMenu(e);
            }}
            size="small"
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </div>

        <Menu
          open={!!taskMenu}
          anchorEl={taskMenu}
          onClose={(e: any) => {
            e.stopPropagation();
            handleCloseTaskMenu();
          }}
          MenuListProps={{
            style: {
              width: 200,
            },
          }}
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask();
            }}
          >
            <DeleteForever color="error" />
            Delete
          </MenuItem>
        </Menu>

        <p className="font-semibold mb-2 capitalize">{task?.name}</p>

        {task?.description ? (
          <p className="line-clamp-2 text-gray-500 my-2">{task?.description}</p>
        ) : null}

        <div className="flex items-center gap-2 rounded-md">
          <div className="flex items-center gap-1">
            {task.assignees?.map((user: any) => (
              <Tooltip title={user?.name} key={user?.id}>
                <IconButton
                  key={user.id}
                  className="min-w-[22px] min-h-[22px] w-[22px] h-[22px] bg-gray-500 text-white rounded-full flex items-center justify-center m-1 text-[10px] capitalize absolute"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAssignee(user?.id);
                  }}
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
            <Add fontSize="small" />
          </IconButton>
        </div>

        <Menu
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={(e: any) => {
            e.stopPropagation();
            setAnchorEl(null);
          }}
          MenuListProps={{
            style: {
              width: 200,
            },
          }}
        >
          {projectUsers?.map((user: any) => (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleAddOrRemoveUser(+user.id);
              }}
              key={user.id}
            >
              <span
                key={user.id}
                className="group min-w-[25px] min-h-[25px] w-[25px] h-[25px] bg-gray-500 text-white rounded-full flex items-center justify-center me-3 text-[10px] capitalize relative"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAssignee(user?.id);
                }}
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  fontSize: 15,
                }}
              >
                {user.name?.[0]}

                {task?.assignees
                  ?.map((assignee: assignee) => assignee?.id)

                  .includes(+user?.id) ? (
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
    </div>
  );
};

export default TaskCard;
