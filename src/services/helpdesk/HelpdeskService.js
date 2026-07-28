import APIHelper from "../../context/ApiHelper.js";
import API from "../../constants/API.js";

const HelpdeskService = {
  getTickets: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.getTickets,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  createITHelpdeskTicket: async (payload) => {
    try {
      const formData = new FormData();

      formData.append("Dept", payload.dept || "");
      formData.append("Ticket_type", payload.ticket_type || "");
      formData.append("Req_type", payload.req_type || "");
      formData.append("Category", payload.category || "");
      formData.append("Project_Module", payload.project || "");
      formData.append("Impact", payload.impact || "");
      formData.append("Description", payload.description || "");
      formData.append("Org", payload.org || "");
      formData.append("Submitted_by", payload.submitted_by || "");
      formData.append("Created_By", payload.created_by || "");
      formData.append("Priority", payload.priority || "");
      formData.append("Parent_Ticket_Id", payload.parent_ticket_id || "");
      formData.append("Creator_Email", payload.Creator_Email || "");
      formData.append("Creator_Name", payload.Creator_Name || "");
      formData.append("user_dept", payload.user_dept || "");

      if (payload.file) {
        formData.append("AttachmentFile", payload.file);
      }

      const response = await APIHelper(
        "POST",
        API.Helpdesk.createITHelpdeskTicket,
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
      );
      return response;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  enrollTicket: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.enrollTicket,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error enrolling ticket:", error);
      throw error;
    }
  },

  reassignTicket: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.reassignTicket,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error reassigning ticket:", error);
      throw error;
    }
  },

  updateTicketStatus: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.updateTicketStatus,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  },

  updateHistory: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.updateHistory,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error updating history:", error);
      throw error;
    }
  },

  getHistoryById: async (ticket_Id) => {
    try {
      const response = await APIHelper("POST", API.Helpdesk.getHistoryById, {
        ticket_Id: ticket_Id,
      });
      return response;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  },

  DownloadFile: async (filePath) => {
    try {
      // Use the updated APIHelper with blob responseType for binary content
      const response = await APIHelper(
        "POST",
        API.FileDownload.DownloadFile,
        {
          filePath: filePath,
        },
        {
          responseType: "blob", // This tells axios to expect binary data
        },
      );

      return response; // This will be a Blob object
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  sendStrike: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.sendStrike,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error sending strike:", error);
      throw error;
    }
  },

  getStrikes: async (ticket_Id) => {
    try {
      const response = await APIHelper("POST", API.Helpdesk.getStrikes, {
        ticket_Id: ticket_Id,
      });
      return response;
    } catch (error) {
      console.error("Error fetching strikes:", error);
      throw error;
    }
  },

  respondStrike: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.respondStrike,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error responding to strike:", error);
      throw error;
    }
  },

  addDiscussion: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.addDiscussion,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error adding discussion:", error);
      throw error;
    }
  },

  getDiscussions: async (ticket_Id) => {
    try {
      const response = await APIHelper("POST", API.Helpdesk.getDiscussions, {
        ticket_Id: ticket_Id,
      });
      return response;
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw error;
    }
  },

  getTicketEmployees: async (dept_Name) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.getTicketEmployees,
        {
          dept_Name: dept_Name,
        },
      );
      return response;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  GetHDCatalog: async () => {
    // fetch commercial invoice data based on invoice number
    try {
      const response = await APIHelper("POST", API.Helpdesk.GetHDCatalog);
      return response;
    } catch (error) {
      console.error("Error fetching HD Catalog data:", error);
      throw error;
    }
  },
  updateUserPassword: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.HDTicketUpdateUserPassword,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  },

  confirmResolvedFeedback: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.HDTicketUpdateStatus,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error confirming resolved feedback:", error);
      throw error;
    }
  },

  getUsersForHD: async () => {
    try {
      const response = await APIHelper("GET", API.Helpdesk.GetUserForHD);
      return response;
    } catch (error) {
      console.error("Error fetching users for HD:", error);
      throw error;
    }
  },

  updateDetailWhileAcceptingTicket: async (payload) => {
    try {
      const response = await APIHelper(
        "POST",
        API.Helpdesk.HDTicketUpdateDetailWhileAcceptingTicket,
        payload,
      );
      return response;
    } catch (error) {
      console.error("Error updating details while accepting ticket:", error);
      throw error;
    }
  },
};

export default HelpdeskService;
