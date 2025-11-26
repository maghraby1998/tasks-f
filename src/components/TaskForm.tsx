import React, { useState } from "react";
import CustomModal from "./CustomModal";
import TextInput from "../inputs/TextInput";
import ValidateAt from "../enums/ValidateAt";
import { IconButton, TextareaAutosize, TextField } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK, upsertTask } from "../graphql/mutations";
import { project } from "../graphql/queries";
import { useFormik } from "formik";

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

interface Values {
  name: string;
  description: string;
}

const TaskForm: React.FC<Props> = ({
  modalData,
  setModalData,
  formData,
  setFormData,
  clientErrors,
  setClientErrors,
}) => {
  const { handleSubmit, errors, values, handleChange } = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values: Values) => {
      console.log("values", values);
    },
  });

  console.log("errors", errors);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [attemptUpsertTask] = useMutation(upsertTask, {
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
  });

  const [attemptUpdateTask] = useMutation(UPDATE_TASK, {
    variables: {
      input: {
        id: formData?.id,
        name: formData?.name,
        usersIds: formData?.userIds,
      },
    },
    onCompleted: () => {
      handleCloseModal();
    },
  });

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsFormSubmitted(true);

  //   if (clientErrors.length) return;

  //   if (formData?.id) {
  //     attemptUpdateTask();
  //   } else {
  //     attemptUpsertTask();
  //   }
  // };

  const handleCloseModal = () => {
    setModalData((_) => ({
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
      disableBackdropClick={false}
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <TextField
          label="name"
          variant="outlined"
          name={"name"}
          value={values.name}
          onChange={handleChange}
          type="text"
        />

        <TextareaAutosize
          onChange={handleChange}
          value={values.description}
          minRows={5}
          inputMode="text"
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
