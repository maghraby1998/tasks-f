import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { project } from "../../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Alert, Box, Grow, IconButton, Snackbar } from "@mui/material";
import {
  Add,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import TaskForm from "../../components/TaskForm";
import { updateTaskStage } from "../../graphql/mutations";

const Board: React.FC = () => {
  const { id } = useParams();

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const [isDraggingMode, setIsDraggingMode] = useState(false);

  const [taskModalData, setTaskModalData] = useState<{
    isOpen: boolean;
    projectId: number | null;
    stageId: number | null;
  }>({
    isOpen: false,
    projectId: null,
    stageId: null,
  });

  const [taskFormData, setTaskFormData] = useState<{
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

  const handleDragStart = (e: any) => {
    if (!ourRef.current || isDraggingMode) return;
    const slider = ourRef.current;
    setIsMouseDown(true);
    slider.style.cursor = "grabbing";
  };

  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    const slider = ourRef.current;

    slider.style.cursor = "grab";
  };

  const handleDrag = (e) => {
    if (!isMouseDown || !ourRef.current || isDraggingMode) return;
    e.preventDefault();
    const slider = ourRef.current;
    slider.scrollLeft =
      e?.movementX > 0 ? slider.scrollLeft - 20 : slider.scrollLeft + 20;
  };

  return (
    <div className="py-2 mt-[80px] max-w-full overflow-hidden m-0">
      <div
        ref={ourRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDrag}
        className={"overflow-x-auto"}
      >
        <div className="flex gap-10 p-5">
          <DragDropContext
            onDragEnd={handleDrop}
            onDragStart={() => setIsDraggingMode(true)}
          >
            {projectData?.project?.stages?.map((stage: any) => {
              return (
                <Box
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
                                <h3 className="text-white capitalize">
                                  {stage?.name}
                                </h3>

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

                              <div className="overflow-auto h-[calc(100vh-120px)]">
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
                                            className="bg-gray-400/20 p-2 my-2 min-h-[100px]"
                                            ref={provideddd.innerRef}
                                            {...provideddd.dragHandleProps}
                                            {...provideddd.draggableProps}
                                          >
                                            <p>{task?.name}</p>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  </>
                                ))}
                                <IconButton
                                  sx={{
                                    borderRadius: "4px",
                                    height: 30,
                                    display: "none",
                                    marginTop: 1,
                                    backgroundColor: "#999",
                                    padding: "0px",
                                  }}
                                  onClick={() => handleOpenTaskModal(stage?.id)}
                                  className="unique-icon-button-class"
                                >
                                  <Add />
                                </IconButton>
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ) : (
                      <div className="w-[40px] min-h-[200px] bg-primary-color rounded-sm">
                        <IconButton
                          sx={{ color: "#fff", marginBottom: 4 }}
                          onClick={() => handleUnCollapseStage(stage?.id)}
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                        <h3 className="text-white capitalize rotate-90 whitespace-nowrap w-full">
                          {stage?.name}
                        </h3>
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
      <button
        className="positoin-fixed top-0 right-0"
        onClick={() => console.log(ourRef.current.scrollLeft)}
      >
        console
      </button>
    </div>
  );
};

export default Board;
