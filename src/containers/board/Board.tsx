import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { project } from "../../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Alert, Grow, IconButton, Snackbar } from "@mui/material";
import { Add } from "@mui/icons-material";
import TaskForm from "../../components/TaskForm";
import { updateTaskStage } from "../../graphql/mutations";

const Board: React.FC = () => {
  const { id } = useParams();

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

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

  return (
    <div className="flex gap-10 m-5 page-container">
      <DragDropContext onDragEnd={handleDrop}>
        {projectData?.project?.stages?.map((stage: any) => {
          return (
            <Grow
              in={true}
              style={{ transformOrigin: "0 0 0" }}
              {...(true ? { timeout: 200 } : {})}
            >
              <div>
                <Droppable droppableId={stage?.id?.toString()}>
                  {(provided) => (
                    <div
                      className="list-container w-[200px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h3 className="h-[30px] bg-primary-color text-white px-2 capitalize rounded-sm">
                        {stage?.name}
                      </h3>
                      {/* {stage?.tasks?.map((item, index) => ( */}
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
                        sx={{ borderRadius: 0, height: 50, marginTop: 1 }}
                        onClick={() => handleOpenTaskModal(stage?.id)}
                      >
                        <Add />
                      </IconButton>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Grow>
          );
        })}
      </DragDropContext>
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
  );
};

export default Board;
