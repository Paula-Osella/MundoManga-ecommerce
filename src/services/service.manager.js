export default class Services {
    constructor(dao) {
      this.dao = dao; 
    }  
    async getAll() {
      try {
        const response = await this.dao.getAll();
        if (!response) throw new Error("Error al traer la informacion");
        return response;
      } catch (error) {
        throw error;
      }
    }
    async create(obj) {
      try {
        const response = await this.dao.create(obj);
        if (!response) throw new Error("Error al crear");
        return response;
      } catch (error) {
        throw new Error(error);
      }
    }
    async update(id, obj) {
      try {
        const response = await this.dao.update(id, obj);
        if (!response) throw new Error("Error error en actualizar");
        return response;
      } catch (error) {
        throw new Error(error);
      }
    }
    async delete(id) {
      try {
        const response = await this.dao.delete(id);
        if (!response) throw new Error("Error delete");
        return response;
      } catch (error) {
        throw new Error(error);
      }
    }
    async getById(id) {
      try {
        const response = await this.dao.getById(id);
        if (!response) throw new Error("Error en traer el id");
        return response;
      } catch (error) {
        throw new Error(error);
      }
    }
  }