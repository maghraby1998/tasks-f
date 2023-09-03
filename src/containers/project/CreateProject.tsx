import React, { useState } from "react";
import TextInput from "../../inputs/TextInput";
import ValidateAt from "../../enums/ValidateAt";
import Stages from "./Stages";

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
  const [formData, setFormData] = useState<FormData>(formInitialState);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [clientErrors, setClientErrors] = useState([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  return (
    <div className="page-container">
      <h2 className="page-title mb-6">new project</h2>
      <form onSubmit={handleSubmit}>
        <TextInput
          name="name"
          value={formData?.name}
          isFormSubmitted={isFormSubmitted}
          setClientErrors={setClientErrors}
          setFormData={setFormData}
          placeholder="name"
          validateAt={ValidateAt.isString}
          containerStyle="mb-5"
          autoFocus
        />

        <h3 className="capitalize font-semibold text-slate-500 mb-2">
          project stages
        </h3>

        <Stages />
      </form>
    </div>
  );
};

export default CreateProject;
