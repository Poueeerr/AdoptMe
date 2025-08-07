import userServices from "../services/userServices.js";

const create = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await userServices.createUser(name, email, password, phone);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.login(email, password);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

const getAll = async (req, res) => {
  try {
    const response = await userServices.getUsers();
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await userServices.getUsersById(id);
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

const getByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await userServices.getUsersByEmail(email);
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

const edit = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const response = await userServices.edit(userId, updateData);
    res.status(200).json(response)

  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};

export default { create, getAll, getById, getByEmail, login , edit};
