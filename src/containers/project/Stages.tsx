import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextInput from "../../inputs/TextInput";
import { Add, DeleteForever, DragHandle } from "@mui/icons-material";
import { IconButton, Slide } from "@mui/material";

interface Props {
  stages: { order: number; name: string }[];
  setStages: React.Dispatch<
    React.SetStateAction<
      {
        order: number;
        name: string;
      }[]
    >
  >;
}

const Stages: React.FC<Props> = ({ stages, setStages }) => {
  const [isDraggingMode, setIsDraggingMode] = useState(false);

  // Function to update list on drop
  const handleDrop = (droppedItem: any) => {
    setIsDraggingMode(false);
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;

    if (droppedItem?.destination?.droppableId === "trash") {
      let updatedList = [...stages];
      // Remove dragged item
      updatedList.splice(droppedItem.source.index, 1);

      // reorder stages' order
      const result = updatedList.map((listItem, index) => ({
        ...listItem,
        order: index + 1,
      }));
      // Update State
      setStages(result);
      return;
    }

    let updatedList = [...stages];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    // reorder stages' order
    const result = updatedList.map((listItem, index) => ({
      ...listItem,
      order: index + 1,
    }));
    // Update State
    setStages(result);
  };

  const handleChangeStageName = (name: string, index: number) => {
    setStages((prev) =>
      prev.map((stage, i) => ({
        ...stage,
        name: index === i ? name : stage.name,
      }))
    );
  };

  const handleAddNewStage = (index: number) => {
    let updatedList = [...stages];

    // Add  item
    updatedList.splice(index + 1, 0, { order: index + 2, name: "" });

    // reorder stages' order
    const result = updatedList.map((listItem, index) => ({
      ...listItem,
      order: index + 1,
    }));
    // Update State
    setStages(result);
  };

  return (
    <div>
      <DragDropContext
        onDragStart={() => setIsDraggingMode(true)}
        onDragEnd={handleDrop}
      >
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <IconButton
                className={`text-sm ${
                  stages.length >= 1 ? "opacity-0" : "opacity-100"
                } hover:opacity-100 w-[400px] h-[30px]`}
                sx={{
                  borderRadius: 0,
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                onClick={() => handleAddNewStage(-1)}
              >
                <Add sx={{ height: 16, width: 16 }} />
                <p className="text-sm">New</p>
              </IconButton>
              {stages.map((item, index) => (
                <>
                  <Draggable
                    key={item.order}
                    draggableId={JSON.stringify(item)}
                    index={index}
                  >
                    {(provideddd) => {
                      return (
                        <div
                          className="item-container"
                          ref={provideddd.innerRef}
                          {...provideddd.dragHandleProps}
                          {...provideddd.draggableProps}
                        >
                          <IconButton
                            sx={{
                              color: "#fff",
                              backgroundColor: "#555",
                              height: "50px",
                              width: "50px",
                              borderRadius: 0,
                              ":hover": {
                                backgroundColor: "#555",
                              },
                            }}
                          >
                            <DragHandle />
                          </IconButton>
                          <TextInput
                            name={`item-${index}`}
                            value={item.name}
                            onChange={(e) =>
                              handleChangeStageName(e.target.value, index)
                            }
                            className="hidden"
                            inputVariant="standard"
                            InputProps={{ disableUnderline: true }}
                            containerStyle="border-l h-full flex items-center pl-2 w-full"
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                  <IconButton
                    className="text-sm flex justify-start opacity-0 hover:opacity-100 w-[400px] h-[30px]"
                    sx={{
                      borderRadius: 0,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                    onClick={() => handleAddNewStage(index)}
                  >
                    <Add sx={{ height: 16, width: 16 }} />
                    <p className="text-sm">New</p>
                  </IconButton>
                </>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Slide direction="left" in={isDraggingMode}>
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
          >
            <Droppable droppableId="trash">
              {(provided, state) => {
                return (
                  <div
                    className={`trash h-[100px] w-[100px] border relative rounded ${
                      state.isDraggingOver ? "bg-red-500" : ""
                    }`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {provided.placeholder}
                    <DeleteForever
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 60,
                        height: 60,
                        color: state.isDraggingOver ? "#fff" : "#333",
                      }}
                    />
                  </div>
                );
              }}
            </Droppable>
          </div>
        </Slide>
      </DragDropContext>
    </div>
  );
};

export default Stages;
