export const DataService = {
  async getTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const json = await res.json();
      return { data: json.data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  async updateTaskStatus(taskId: string, newStatus: string) {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const json = await res.json();
      return { data: json.data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  async getTeamMembers() {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const json = await res.json();
      return { data: json.data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  }
};
