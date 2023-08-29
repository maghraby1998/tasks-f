import React, { useState } from "react";

const Board: React.FC = () => {
  const [board, setBoard] = useState([
    {
      id: 1,
      name: "stage 1",
      tasks: [{ id: 1, name: "random task name" }],
    },
    {
      id: 2,
      name: "stage 2",
      tasks: [{ id: 2, name: "another task name" }],
    },
  ]);

  const [draggedTaskDetails, setDraggedTaskDetails] = useState<null | {
    boardStageId: number;
    task: { id: number; name: string };
  }>(null);

  const handleOnDragStart = (
    boardStageId: number,
    task: { id: number; name: string }
  ) => {
    setDraggedTaskDetails({ boardStageId, task });
  };

  const handleDrop = (e: any, boardStageId: number) => {
    e.preventDefault();

    setBoard((prev) => {
      return prev.map((boardStage) => {
        if (boardStage.id === boardStageId) {
          return {
            ...boardStage,
            tasks: [...boardStage.tasks, draggedTaskDetails?.task],
          };
        } else if (boardStage.id === draggedTaskDetails?.boardStageId) {
          return {
            ...boardStage,
            tasks: boardStage.tasks.filter(
              (task) => task.id !== draggedTaskDetails.task.id
            ),
          };
        } else {
          return boardStage;
        }
      });
    });

    setDraggedTaskDetails(null);
  };

  return (
    <div className="flex gap-10 m-5">
      {board.map((boardStage) => {
        return (
          <div className="w-[200px]">
            <p className="h-[30px] bg-slate-500 px-1 flex items-center text-white capitalize">
              {boardStage.name}
            </p>
            <div
              className="pb-[30px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, boardStage.id)}
            >
              {boardStage.tasks.map((task) => {
                return (
                  <p
                    draggable
                    onDragStart={() => handleOnDragStart(boardStage.id, task)}
                    className={`h-[80px] bg-gray-300 flex items-center px-1 my-2`}
                  >
                    {task.name}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
