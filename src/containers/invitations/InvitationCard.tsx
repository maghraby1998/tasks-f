import React from "react";
import InvitationStatus from "../../enums/InvitationStatus";
import { IconButton } from "@mui/material";
import { Block, Check, Close, ThumbsUpDown } from "@mui/icons-material";
import {
  ACCEPT_INVITATION,
  CANCEL_INVITATION,
  REJECT_INVITATION,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import {
  GET_RECEIVED_INVITATIONS,
  GET_SENT_INVITATIONS,
  projects,
} from "../../graphql/queries";

const pendingColor = "#666";
const acceptedColor = "#1bd930";
const rejectedColor = "#d91b1b";

interface Props {
  id: number;
  senderName?: string;
  receiverName?: string;
  project: { id: number; name: string };
  status: string;
}

const InvitationCard: React.FC<Props> = ({
  id,
  senderName,
  receiverName,
  project,
  status,
}) => {
  let invitationColor =
    status === InvitationStatus.PENDING
      ? pendingColor
      : status === InvitationStatus.ACCEPTED
      ? acceptedColor
      : rejectedColor;

  const [attemptAcceptInviation, { loading: acceptLoading }] = useMutation(
    ACCEPT_INVITATION,
    {
      variables: {
        invitationId: id,
      },
      refetchQueries: [
        { query: GET_RECEIVED_INVITATIONS },
        { query: projects },
      ],
    }
  );

  const [attemptrejectInviation, { loading: rejectLoading }] = useMutation(
    REJECT_INVITATION,
    {
      variables: {
        invitationId: id,
      },
      refetchQueries: [{ query: GET_RECEIVED_INVITATIONS }],
    }
  );

  const [attemptCancelInviation, { loading: cancelLoading }] = useMutation(
    CANCEL_INVITATION,
    {
      variables: {
        invitationId: id,
      },
      refetchQueries: [{ query: GET_SENT_INVITATIONS }],
    }
  );

  const isButtonsDisabled = acceptLoading || rejectLoading || cancelLoading;

  const shouldShowActions = status === InvitationStatus.PENDING;

  return (
    <div
      className={`rounded overflow-hidden border `}
      style={{ borderColor: invitationColor }}
    >
      <div
        className={`p-1 flex items-center justify-between`}
        style={{ backgroundColor: invitationColor }}
      >
        {senderName ? (
          <p className="flex-1 text-white capitalize">from</p>
        ) : null}
        {receiverName ? (
          <p className="flex-1 text-white capitalize">to</p>
        ) : null}
        <p className="flex-1 text-white capitalize">project</p>
        <p className="flex-1 text-white capitalize">status</p>
        <p className="flex-1 text-white capitalize">
          {shouldShowActions ? "actions" : ""}
        </p>
      </div>

      <div className="p-1 flex items-center justify-between">
        {senderName ? <p className="flex-1 capitalize">{senderName}</p> : null}
        {receiverName ? (
          <p className="flex-1 capitalize">{receiverName}</p>
        ) : null}
        <p className="flex-1 capitalize">{project.name}</p>
        <p className="flex-1 capitalize">{status}</p>

        <div className="flex-1">
          {shouldShowActions ? (
            <>
              {senderName ? (
                <>
                  <IconButton
                    disabled={isButtonsDisabled}
                    onClick={() => attemptAcceptInviation()}
                  >
                    <Check style={{ color: "green" }} />
                  </IconButton>
                  <IconButton
                    disabled={isButtonsDisabled}
                    onClick={() => attemptrejectInviation()}
                  >
                    <Block style={{ color: "red" }} />
                  </IconButton>
                </>
              ) : null}

              {receiverName ? (
                <IconButton
                  disabled={isButtonsDisabled}
                  onClick={() => attemptCancelInviation()}
                >
                  <Close style={{ color: "red" }} />
                </IconButton>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
