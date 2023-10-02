import React, { useState } from "react";
import CustomModal from "./CustomModal";
import TextInput from "../inputs/TextInput";
import ValidateAt from "../enums/ValidateAt";
import { IconButton } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK, upsertTask } from "../graphql/mutations";
import { project } from "../graphql/queries";

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

const TaskForm: React.FC<Props> = ({
  modalData,
  setModalData,
  formData,
  setFormData,
  clientErrors,
  setClientErrors,
}) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [attemptUpsertTask, { loading: upsertTaskLoading }] = useMutation(
    upsertTask,
    {
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
    }
  );

  const [attemptUpdateTask, { loading: updateTaskLoading }] = useMutation(
    UPDATE_TASK,
    {
      variables: {
        input: {
          id: formData?.id,
          name: formData?.name,
          usersIds: formData?.userIds,
        },
      },
      onCompleted: (data) => {
        handleCloseModal();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (clientErrors.length) return;

    if (formData?.id) {
      attemptUpdateTask();
    } else {
      attemptUpsertTask();
    }
  };

  const handleCloseModal = () => {
    setModalData((prev) => ({
      isOpen: false,
      projectId: null,
      stageId: null,
    }));

    setFormData({ name: "", userIds: [] });
  };

  return (
    <CustomModal
      isOpen={modalData.isOpen}
      modalTitle="Task"
      onClose={handleCloseModal}
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <TextInput
          name="name"
          value={formData.name}
          setFormData={setFormData}
          placeholder="Name"
          isFormSubmitted={isFormSubmitted}
          validateAt={ValidateAt.isString}
          autoFocus
          setClientErrors={setClientErrors}
        />

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
