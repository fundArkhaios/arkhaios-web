"use client";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

export default function MappedUsers({ fund }) {
  const { error, isLoading, responseJSON } = useFetch(
    "/api/fund/members?id=" + fund.fundID
  );
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (responseJSON) {
      setMembers(responseJSON.data.members);
    }
  }, [isLoading]);

  // Function to calculate the total amount invested for a member
  const calculateTotalInvested = (memberId) => {
    return fund.completedJournals.reduce((total, journal) => {
      if (journal.user === memberId) {
        // Ensure the amount is a number before adding it to the total
        return total + Number(journal.amount);
      }
      return total;
    }, 0);
  };

  const MemberCard = ({ member }) => {
    // Call calculateTotalInvested for each member to get the total invested amount
    const totalInvested = calculateTotalInvested(member.id).toFixed(2);

    return (
      <div className="flex-shrink-0 w-64 h-32 bg-gray-200 rounded-md hover:opacity-100 opacity-90">
        <div className="grid grid-rows-2">
          <p className="text-lg p-2 text-black">{member.name}</p>
          <div className="flex flex-row items-end p-2">
            {/* Dynamically display the total invested amount */}
            <p className="text-4xl font-bold text-black">${totalInvested}</p>
            <p className="font-thin text-xs text-black">Amount Invested</p>
          </div>
        </div>
      </div>
    );
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-row overflow-x-auto gap-4 scrollable-container">
      {members.length != 0 ? (
        members?.map((member) => (
          <div key={member.id}>
            <MemberCard member={member} />
          </div>
        ))
      ) : (
        <p className="font-light text-lg">No members in fund.</p>
      )}
    </div>
  );
}
