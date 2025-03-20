import NotesApi from "../data/remote/notes-api.js";

const ApiHandler = {
  async addNote(title, body) {
    try {
      await NotesApi.addNote(title, body);
      document.dispatchEvent(new CustomEvent("noteAdded"));
      return { success: true, message: "Catatan berhasil ditambahkan!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

export default ApiHandler;
