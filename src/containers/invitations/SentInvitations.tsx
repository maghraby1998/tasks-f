import { useQuery } from "@apollo/client";
import { GET_SENT_INVITATIONS } from "../../graphql/queries";
import InvitationCard from "./InvitationCard";

const SentInvitations = () => {
  const { data, loading } = useQuery(GET_SENT_INVITATIONS, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="page-container">
      <h1 className="capitalize font-semibold text-primary-color border-b-2 mb-5">
        sent invitations
      </h1>

      <div className="flex flex-col gap-5">
        {data?.sentInvitations?.map(
          (invitation: {
            id: number;
            receiver: { name: string };
            project: { id: number; name: string };
            status: string;
          }) => (
            <InvitationCard
              key={invitation.id}
              id={invitation.id}
              receiverName={invitation.receiver.name}
              project={invitation.project}
              status={invitation.status}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SentInvitations;
