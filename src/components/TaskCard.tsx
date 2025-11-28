import { Avatar } from "@mui/material";
import React from "react";

interface Task {
  id: number;
  name: string;
  assignees: { id: number; name: string }[];
}

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="text-sm bg-gray-400/20 p-2 my-2 min-h-[100px] rounded-sm">
      <p>{task?.name}</p>
      {task.assignees.map((assignee) => (
        <Avatar
          key={assignee.id}
          sx={{ width: 24, height: 24, fontSize: 12, marginRight: 0.5 }}
        >
          {assignee.name.charAt(0)}
        </Avatar>
      ))}
    </div>
  );
};

export default TaskCard;
