import { Alert, CircularProgress, Dialog, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextInput from "../../inputs/TextInput";
import ValidateAt from "../../enums/ValidateAt";
import { useMutation } from "@apollo/client";
import { INVITE_USER_TO_PROJECT } from "../../graphql/mutations";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

const InvitationDialog: React.FC<Props> = ({ open, onClose, projectId }) => {
  const [email, setEmail] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [clientErrors, setClientErrors] = useState<string[]>([]);

  const [attemptInviteUser, { loading, error }] = useMutation(
    INVITE_USER_TO_PROJECT,
    {
      variables: {
        input: { email, projectId },
      },
      onError: () => {
        setErrorShown(true);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsFormSubmitted(true);

    if (clientErrors.length) return;

    attemptInviteUser();
  };

  const [errorShown, setErrorShown] = useState(false);

  const handleClose = () => {
    setErrorShown(false);
  };

  useEffect(() => {
    return () => {
      setEmail("");
      setClientErrors([]);
    };
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <form className="p-6 flex flex-col gap-3" onSubmit={handleSubmit}>
        <h3 className="text-[#333] font-semibold capitalize">invite a user</h3>
        <TextInput
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isFormSubmitted={isFormSubmitted}
          validateAt={ValidateAt.isEmail}
          setClientErrors={setClientErrors}
          placeholder="Email"
        />
        <button
          type="submit"
          className="capitalize font-semi-bold block mx-auto bg-green-500 text-white px-3 py-1 rounded font-semibold"
          disabled={loading || !!!email}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "#fff" }} />
          ) : (
            "invite"
          )}
        </button>
      </form>

      <Snackbar open={errorShown} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error?.graphQLErrors[0].message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default InvitationDialog;
