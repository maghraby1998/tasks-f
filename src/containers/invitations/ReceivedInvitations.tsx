import { useQuery } from "@apollo/client";
import { GET_RECEIVED_INVITATIONS } from "../../graphql/queries";
import InvitationCard from "./InvitationCard";

const ReceivedInvitations = () => {
  const { data, loading } = useQuery(GET_RECEIVED_INVITATIONS);

  return (
    <div className="page-container">
      <h1 className="capitalize font-semibold text-primary-color border-b-2 mb-5">
        received invitations
      </h1>

      <div className="flex flex-col gap-5">
        {data?.receivedInvitations?.map(
          (invitation: {
            id: number;
            sender: { name: string };
            project: { id: number; name: string };
            status: string;
          }) => (
            <InvitationCard
              key={invitation.id}
              id={invitation.id}
              senderName={invitation.sender.name}
              project={invitation.project}
              status={invitation.status}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ReceivedInvitations;
