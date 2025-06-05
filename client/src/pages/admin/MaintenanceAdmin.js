import { useEffect, useState } from 'react';
import axios from 'axios';
import MaintenanceCard from '../../components/MaintenanceCard';
import { toast } from 'react-toastify';

export default function MaintenanceAdmin() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const { data } = await axios.get('/api/maintenance', { withCredentials: true });
    setTickets(data);
  };

  const assignTicket = async (ticketId) => {
    await axios.put(`/api/maintenance/${ticketId}/assign`, {}, { withCredentials: true });
    toast.success('Ticket assigned');
    fetchTickets();
  };

  const updateStatus = async (ticketId) => {
    const resolutionNote = prompt('Add a resolution note (optional)');
    await axios.put(`/api/maintenance/${ticketId}/resolve`, { resolutionNote }, { withCredentials: true });
    toast.success('Ticket resolved');
    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">All Maintenance Requests</h1>
      {tickets.map((ticket) => (
        <MaintenanceCard
          key={ticket._id}
          ticket={ticket}
          onAssign={() => assignTicket(ticket._id)}
          onUpdate={() => updateStatus(ticket._id)}
        />
      ))}
    </div>
  );
}
