import React, { useEffect, useState } from "react";
import TextInput from "../../inputs/TextInput";
import ValidateAt from "../../enums/ValidateAt";
import Stages from "./Stages";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { updateProject, upsertProject } from "../../graphql/mutations";
import { project, projects } from "../../graphql/queries";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import Members from "./Members";

interface Stage {
  name: string;
  order: number;
}

interface FormData {
  id?: number | null;
  name: string;
}

const formInitialState = { id: null, name: "" };

const CreateProject = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] = useState<FormData>(formInitialState);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [stages, setStages] = useState<
    { id?: number; order: number; name: string }[]
  >([]);
  const [clientErrors, setClientErrors] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const [attemptFetchProject, { loading: fetchProjectLoading }] = useLazyQuery(
    project,
    {
      variables: { id },
      onCompleted: (data) => {
        const { id, name, stages } = data?.project ?? {};

        setFormData({ id, name });
        setStages(stages?.map(({ id, name, order }) => ({ id, name, order })));
      },
    }
  );

  useEffect(() => {
    if (id) {
      attemptFetchProject();
    }
  }, []);

  const [attemptUpsertProject, { loading: upsertProjectLoading }] = useMutation(
    upsertProject,
    {
      variables: {
        input: { name: formData.name, stages },
      },
      onCompleted: (data) => {
        navigate(`/board/${data?.upsertProject?.id}`);
      },
      refetchQueries: [{ query: projects }],
    }
  );

  const [attemptUpdateProject, { loading: updateProjectLoading }] = useMutation(
    updateProject,
    {
      variables: {
        input: { id: formData?.id, name: formData.name, stages },
      },
      onCompleted: (data) => {
        navigate(`/board/${data?.updateProject?.id}`);
      },
      refetchQueries: [{ query: projects }],
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    const unNamedStage = stages.find((stage) => !!!stage.name);

    if (unNamedStage) {
      setIsSnackBarOpen(true);
      return;
    }

    if (clientErrors.length) return;

    if (formData?.id) {
      attemptUpdateProject();
    } else {
      attemptUpsertProject();
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title mb-6">new project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <TextInput
          name="name"
          value={formData?.name}
          isFormSubmitted={isFormSubmitted}
          setClientErrors={setClientErrors}
          setFormData={setFormData}
          placeholder="Name"
          validateAt={ValidateAt.isString}
          containerStyle="mb-5"
          autoFocus
        />

        <h3 className="capitalize font-semibold text-slate-500 mb-2">
          project stages
        </h3>

        <Stages stages={stages} setStages={setStages} />

        {/* <Members /> */}

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

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isSnackBarOpen}
        // autoHideDuration={6000}
        onClose={() => setIsSnackBarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackBarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Please name all the created stages otherwise delete the unnamed ones.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateProject;
