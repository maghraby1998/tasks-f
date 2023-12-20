import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_TASK, INVITATION_ACCEPTED, project } from "../../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Alert, Box, Grow, IconButton, Snackbar } from "@mui/material";
import {
  Add,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PersonAddAlt,
  Settings,
} from "@mui/icons-material";
import TaskForm from "../../components/TaskForm";
import { updateTaskStage } from "../../graphql/mutations";
import { useNavigate } from "react-router-dom";
import InvitationDialog from "../invitations/InvitationDialog";

const Board: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const [isDraggingMode, setIsDraggingMode] = useState(false);

  const [taskModalData, setTaskModalData] = useState<{
    isOpen: boolean;
    projectId?: number | null;
    stageId?: number | null;
  }>({
    isOpen: false,
    projectId: null,
    stageId: null,
  });

  const [taskFormData, setTaskFormData] = useState<{
    id?: number | null;
    name: string;
    userIds: string[];
  }>({ name: "", userIds: [] });

  const [taskFormClientErrors, setTaskFormClientErrors] = useState<string[]>(
    []
  );

  const [collapsedStages, setCollapsedStages] = useState<number[]>([]);

  const handleCollapseStage = (stageId: number) => {
    setCollapsedStages((prev) => [...prev, stageId]);
  };

  const handleUnCollapseStage = (stageId: number) => {
    setCollapsedStages((prev) => prev.filter((id) => id !== stageId));
  };

  const { loading: projectLoading, data: projectData } = useQuery(project, {
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  const [attemptUpdateTaskStage, { loading: updateTaskStageLoading }] =
    useMutation(updateTaskStage, {
      onCompleted: (data) => {
        setIsSnackBarOpen(true);
      },
      refetchQueries: [{ query: project, variables: { id } }],
    });

  const handleDrop = (droppedItem: any) => {
    setIsDraggingMode(false);

    const stageDraggedFrom = droppedItem?.source?.droppableId;

    const stageDraggedTo = droppedItem?.destination?.droppableId;

    // return if task is dropped in the same stage
    if (stageDraggedFrom === stageDraggedTo) {
      return;
    }

    const draggedTaskId = droppedItem?.draggableId;

    attemptUpdateTaskStage({
      variables: {
        input: {
          taskId: +draggedTaskId,
          stageId: +stageDraggedTo,
        },
      },
    });
  };

  const handleOpenTaskModal = (stageId: number) => {
    setTaskModalData({ isOpen: true, projectId: id ? +id : null, stageId });
  };

  const ourRef = useRef<any>(null);

  useEffect(() => {
    const slider = ourRef.current;

    slider.style.cursor = "grab";
  }, []);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (e: any) => {
    if (!ourRef.current || isDraggingMode) return;
    const slider = ourRef.current;
    setIsMouseDown(true);
    slider.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    const slider = ourRef.current;

    slider.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !ourRef.current || isDraggingMode) return;
    e.preventDefault();
    const slider = ourRef.current;
    slider.scrollLeft =
      e?.movementX > 0 ? slider.scrollLeft - 12 : slider.scrollLeft + 12;
  };

  const [attemptGetTask, { loading: getTaskLoading }] = useLazyQuery(GET_TASK, {
    onCompleted: (data) => {
      console.log(data);
      const { id, name, users } = data?.task ?? {};
      setTaskModalData({ isOpen: true });
      setTaskFormData({ id, name, userIds: [] });
    },
  });

  const handleEditTask = (id: number) => {
    attemptGetTask({
      variables: {
        id,
      },
    });
  };

  const handleEditProject = () => {
    navigate(`/edit-project/${projectData?.project?.id}`);
  };

  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

  const handleInviteUser = () => {
    setIsInvitationModalOpen(true);
  };

  const handleCloseInvitationModal = () => {
    setIsInvitationModalOpen(false);
  };

  return (
    <div className="py-2 mt-[80px] max-w-full overflow-hidden m-0">
      <div className="mx-5 p-2 rounded-sm bg-secondary-color flex items-center justify-between">
        <h2 className="capitalize text-[#333] font-bold">
          {projectData?.project?.name}
        </h2>
        <div className="flex items-center justify-center">
          <IconButton onClick={handleInviteUser}>
            <PersonAddAlt />
          </IconButton>
          <IconButton onClick={handleEditProject}>
            <Settings />
          </IconButton>
        </div>
      </div>
      <div
        ref={ourRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="overflow-x-auto"
      >
        <div className="flex gap-10 p-5">
          <DragDropContext
            onDragEnd={handleDrop}
            onDragStart={() => setIsDraggingMode(true)}
          >
            {projectData?.project?.stages?.map((stage: any) => {
              return (
                <Box
                  key={stage?.id}
                  sx={{
                    ":hover": {
                      ".unique-icon-button-class": {
                        display: "flex",
                        alignItems: "center",
                      },
                    },
                  }}
                >
                  <Grow
                    in={true}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(true ? { timeout: 200 } : {})}
                  >
                    {!collapsedStages?.includes(stage?.id) ? (
                      <div>
                        <Droppable droppableId={stage?.id?.toString()}>
                          {(provided) => (
                            <div
                              className="list-container w-[200px]"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <div className="h-[30px] bg-primary-color px-2 rounded-sm flex items-center justify-between">
                                <div className="flex items-center">
                                  <h3
                                    title={stage?.name}
                                    className="text-white capitalize text-sm mr-2 font-bold truncate w-[120px]"
                                  >
                                    {stage?.name}
                                  </h3>
                                  <p className="text-sm bg-white h-[18px] w-[18px] rounded-full flex items-center justify-center">
                                    {stage?.tasks?.length}
                                  </p>
                                </div>

                                <div className="flex items-center">
                                  <IconButton
                                    sx={{ color: "#fff" }}
                                    onClick={() =>
                                      handleCollapseStage(stage?.id)
                                    }
                                  >
                                    <KeyboardArrowLeft />
                                  </IconButton>
                                </div>
                              </div>

                              <div className="overflow-auto h-[calc(100vh-180px)]">
                                {stage?.tasks?.map((task, index) => (
                                  <>
                                    <Draggable
                                      key={task?.id}
                                      draggableId={task?.id?.toString()}
                                      index={index}
                                    >
                                      {(provideddd) => {
                                        return (
                                          <div
                                            onClick={() =>
                                              handleEditTask(task?.id)
                                            }
                                            className="bg-gray-400/20 p-2 my-2 min-h-[100px] rounded-sm"
                                            ref={provideddd.innerRef}
                                            {...provideddd.dragHandleProps}
                                            {...provideddd.draggableProps}
                                          >
                                            <p className="text-sm capitalize">
                                              {task?.name}
                                            </p>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  </>
                                ))}
                                <IconButton
                                  sx={{
                                    borderRadius: "4px",
                                    display: "none",
                                    width: "fit-content",
                                    marginTop: 1,
                                    backgroundColor: "#999",
                                    padding: "4px",
                                    color: " #fff",
                                    ":hover": {
                                      backgroundColor: "#777",
                                    },
                                  }}
                                  onClick={() => handleOpenTaskModal(stage?.id)}
                                  className="unique-icon-button-class"
                                >
                                  <Add sx={{ height: 15, width: 15 }} />
                                  <p className="text-sm capitalize">new</p>
                                </IconButton>
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ) : (
                      <div className="w-[40px] min-h-[350px] bg-primary-color rounded-sm">
                        <IconButton
                          sx={{ color: "#fff", marginBottom: 2 }}
                          onClick={() => handleUnCollapseStage(stage?.id)}
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-white capitalize mb-2 text-orientation-down">
                            {stage?.name}
                          </h3>

                          <p className="text-sm bg-white h-[18px] w-[18px] rounded-full flex items-center justify-center text-orientation-down">
                            {stage?.tasks?.length}
                          </p>
                        </div>
                      </div>
                    )}
                  </Grow>
                </Box>
              );
            })}
          </DragDropContext>
        </div>
        {taskModalData.isOpen ? (
          <TaskForm
            modalData={taskModalData}
            setModalData={setTaskModalData}
            formData={taskFormData}
            setFormData={setTaskFormData}
            clientErrors={taskFormClientErrors}
            setClientErrors={setTaskFormClientErrors}
          />
        ) : null}

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={isSnackBarOpen}
          autoHideDuration={2000}
          onClose={() => setIsSnackBarOpen(false)}
        >
          <Alert
            onClose={() => setIsSnackBarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Moved Succesfully.
          </Alert>
        </Snackbar>
      </div>

      {id ? (
        <InvitationDialog
          open={isInvitationModalOpen}
          onClose={handleCloseInvitationModal}
          projectId={+id}
        />
      ) : null}
    </div>
  );
};

export default Board;
