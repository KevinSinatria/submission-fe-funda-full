const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static addNote(title, body) {
    return fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Something went wrong`));
        }
      })
      .then((responseJson) => {
        alert(responseJson.message);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan: ", error);
        alert(`Gagal menyimpan data: ${error.message}`);
      });
  }

  static async getAll() {
    console.log("getAll() dipanggil.");
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) {
        throw new Error(`Something went wrong`);
      }

      const responseJson = await response.json();
      const { data } = responseJson;

      if (data.length > 0) {
        return data;
      } else {
        throw new Error(`Tidak ada catatan.`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async getArchived() {
    console.log("getArchived() dipanggil.");
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error(`Something went wrong`);
      }

      const responseJson = await response.json();
      const { data } = responseJson;

      if (data.length > 0) {
        return data;
      } else {
        throw new Error(`Tidak ada catatan.`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Something went wrong`);
      } else {
        const responseJson = await response.json();
        alert(responseJson.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan: ", error);
      alert(`Gagal menghapus data: ${error.message}`);
    }
  }

  static async archiveNote(noteId) {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Gagal mengarsipkan catatan");
    }

    return response.json();
  }

  static async unarchiveNote(noteId) {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Gagal membatalkan arsip catatan");
    }

    return response.json();
  }
}

export default NotesApi;
