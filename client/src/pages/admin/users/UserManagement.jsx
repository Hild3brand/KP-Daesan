import { useEffect, useMemo, useState } from "react";

import API from "../../../services/api";
import { getUser } from "../../../utils/auth";

import "./UserManagement.css";

export default function UserManagement() {
    const [users, setUsers] = useState([]);

    const [roles, setRoles] = useState([]);

    const [stages, setStages] = useState([]);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [errors, setErrors] = useState({});

    const [showSuccess, setShowSuccess] =
    useState(false);

    const [successMessage, setSuccessMessage] =
    useState("");

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        password: "",
        roles_id: "",
        stage_code: "",
    });

    const currentUser = getUser();
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchStages();
    }, []);

    const fetchUsers = async () => {
        try {

            const res = await API.get("/users");

            setUsers(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    const fetchRoles = async () => {
        try {

            const res = await API.get("/roles");

            setRoles(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    const fetchStages = async () => {
        try {

            const res = await API.get("/stages");

            setStages(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);

        setFormData({
            id: user.id,
            name: user.name,
            password: "",
            roles_id: user.role_id,
            stage_code: user.stage_code,
            status: "Active",
        });

        setShowEditModal(true);
    };

    const handleOpenDelete = (user) => {
        console.log("DELETE USER:", user); // DEBUG

        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleAddUser = async () => {

    if (!validateForm()) return;

    try {

        await API.post(
            "/users/register",
            formData
        );

        setSuccessMessage(
            "User berhasil ditambahkan"
        );

        setShowSuccess(true);

        fetchUsers();

        setShowAddModal(false);

        setFormData({
            id: "",
            name: "",
            password: "",
            roles_id: "",
            stage_code: "",
            status: "",
        });

        setErrors({});

    } catch (err) {

        console.log(err);

        setErrors((prev) => ({
            ...prev,
            api:
                err.response?.data?.message,
        }));
    }
};

    const handleUpdateUser = async () => {

    if (!validateForm()) return;

    try {

        await API.put(
            `/users/${selectedUser.id}`,
            formData
        );

        setSuccessMessage(
            "User berhasil diupdate"
        );

        setShowSuccess(true);

        fetchUsers();

        setShowEditModal(false);

        setErrors({});

    } catch (err) {

        console.log(err);
    }
};

    const handleDeleteUser = async () => {

    if (!selectedUser?.id) return;

    try {

        await API.delete(
            `/users/${selectedUser.id}`
        );

        setSuccessMessage(
            "User berhasil dihapus"
        );

        setShowSuccess(true);

        fetchUsers();

        setShowDeleteModal(false);

        setSelectedUser(null);

    } catch (err) {

        console.log(err);
    }
};

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {

            const matchSearch =
                user.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.id
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchRole =
                roleFilter === "All" ||
                user.role_name === roleFilter;

            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    const totalPages = Math.ceil(
        filteredUsers.length / usersPerPage
    );

    const startIndex =
        (currentPage - 1) * usersPerPage;

    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    const validateForm = () => {
        const newErrors = {};

        if (!formData.id) newErrors.id = "User ID is required";
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.password && !selectedUser)
            newErrors.password = "Password is required";
        if (!formData.roles_id) newErrors.roles_id = "Role is required";
        if (!formData.status) newErrors.status = "Status is required";
        if (!formData.stage_code) newErrors.stage_code = "Stage is required";

        // CEK DUPLIKAT ID (ADD ONLY)
        if (!selectedUser) {
            const exists = users.find(
            (u) => u.id === formData.id
            );

            if (exists) {
            newErrors.id = "User ID already exists";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    return (
        <div className="user-management-container">
             {/* SUCCESS MODAL */}
                {showSuccess && (

                    <div
                        className="
                            modal
                            fade
                            show
                        "
                        tabIndex="-1"
                        style={{
                            display: "block",
                            backgroundColor:
                                "rgba(0,0,0,0.5)",
                            zIndex: 9999,
                        }}
                    >

                        <div
                            className="
                                modal-dialog
                                modal-dialog-centered
                            "
                        >

                            <div className="modal-content">

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Success
                                    </h5>

                                </div>

                                <div className="modal-body">

                                    <p
                                        style={{
                                            marginBottom: 0,
                                        }}
                                    >
                                        {successMessage}
                                    </p>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="
                                            btn
                                            btn-primary
                                        "
                                        onClick={() =>
                                            setShowSuccess(false)
                                        }
                                    >
                                        OK
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            {/* HEADER */}
            <div className="user-management-header">

                <div>
                    <h1>User Management</h1>

                    <p style={{ margin: "0px" }}>Manage all system users</p>
                </div>
                <button className="add-user-button" onClick={() => setShowAddModal(true)}>
                    Add User
                </button>

            </div>

            {/* FILTER */}
            <div className="user-management-filter">

                <input type="text" placeholder="Search by ID or Name" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input"/>

                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="role-filter">
                    <option value="All">
                        All Roles
                    </option>

                    {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>

            </div>

            {/* TABLE */}
            <div className="table-wrapper">

                <table className="user-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Stage</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>

                                    <td>{user.name}</td>

                                    <td>{user.role_name}</td>

                                    <td>{user.stage_code} - {user.stage_name}</td>

                                    <td>
                                        <div className="action-buttons">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleOpenEdit(user)
                                                }
                                            >
                                                Edit
                                            </button>

                                            {String(user.id) !== String(currentUser.id) && (
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleOpenDelete(user)}
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="empty-data"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}
            <div className="pagination">

                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
                >
                    Prev
                </button>

                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>

                <button
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
                >
                    Next
                </button>

            </div>

            {/* ADD MODAL */}
            {showAddModal && (
            <div
                className="modal-overlay"
                onClick={() => setShowAddModal(false)}
            >
                <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="modal-header">
                    <h2>Add User</h2>
                    <button
                    className="modal-close"
                    onClick={() => setShowAddModal(false)}
                    >
                    ✕
                    </button>
                </div>

                {errors.api && (<div className="api-error"> {errors.api}</div>)}

                <div className="modal-body">

                    <div className="form-group">
                    <label>User ID</label>
                    <input
                        value={formData.id}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            id: e.target.value,
                        })
                        }
                    />
                    {errors.id && <small className="error-text">{errors.id}</small>}
                    </div>

                    <div className="form-group">
                    <label>Name</label>
                    <input
                        value={formData.name}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                        }
                    />
                    {errors.name && <small className="error-text">{errors.name}</small>}
                    </div>

                    <div className="form-group">
                    <label>Password</label>
                    <input
                        type="text"
                        value={formData.password}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value,
                        })
                        }
                    />
                    {errors.password && <small className="error-text">{errors.password}</small>}
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                            }
                        >
                            <option value="" disabled selected>
                                -- Select Status --
                            </option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        {errors.status && (
                            <small className="error-text">{errors.status}</small>
                        )}
                    </div>

                    <div className="form-group">
                    <label>Role</label>
                    <select
                        value={formData.roles_id}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            roles_id: Number(e.target.value),
                        })
                        }
                    >
                        <option value="" disabled>
                            -- Select Role --
                        </option>
                        {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                        ))}
                    </select>
                    {errors.roles_id && <small className="error-text">{errors.roles_id}</small>}
                    </div>

                    <div className="form-group">
                    <label>Stage</label>
                    <select
                        value={formData.stage_code}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            stage_code: e.target.value,
                        })
                        }
                    >
                        <option value="" disabled>
                            -- Select Stage --
                        </option>
                        {stages.map((stage) => (
                        <option key={stage.stage_code} value={stage.stage_code}>
                            {stage.stage_code} - {stage.stage_name}
                        </option>
                        ))}
                    </select>
                    {errors.stage_code && <small className="error-text">{errors.stage_code}</small>}
                    </div>

                </div>

                <div className="modal-actions">
                    <button
                    className="cancel-button"
                    onClick={() => setShowAddModal(false)}
                    >
                    Cancel
                    </button>

                    <button
                    className="save-button"
                    onClick={handleAddUser}
                    >
                    Save
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && (
            <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit User</h2>
                    <button className="modal-close"  onClick={() => setShowEditModal(false)}>
                    ✕
                    </button>
                </div>

                <div className="modal-body">

                    <div className="form-group">
                    <label>User ID</label>
                    <input value={formData.id} disabled />
                    </div>

                    <div className="form-group">
                    <label>Name</label>
                    <input
                        value={formData.name}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                        }
                    />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                            }
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        {errors.status && (
                            <small className="error-text">{errors.status}</small>
                        )}
                    </div>

                    <div className="form-group">
                    <label>Role</label>
                    <select
                        value={formData.roles_id}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            roles_id: Number(e.target.value),
                        })
                        }
                    >
                        {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Stage</label>
                    <select
                        value={formData.stage_code}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            stage_code: e.target.value,
                        })
                        }
                    >
                        {stages.map((stage) => (
                        <option key={stage.stage_code} value={stage.stage_code}>
                            {stage.stage_code} - {stage.stage_name}
                        </option>
                        ))}
                    </select>
                    {errors.stage_code && <small className="error-text">{errors.stage_code}</small>}
                    </div>

                </div>

                <div className="modal-actions">
                    <button
                    className="cancel-button"
                    onClick={() => setShowEditModal(false)}
                    >
                    Cancel
                    </button>

                    <button
                    className="save-button"
                    onClick={handleUpdateUser}
                    >
                    Update
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowDeleteModal(false)
                    }
                >
                    <div
                        className="delete-modal-box"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h2>Delete User</h2>

                        <p>
                            Are you sure want to delete{" "}
                            <strong>
                                {selectedUser?.name}
                            </strong>
                            ?
                        </p>

                        <div className="modal-actions">

                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm-button"
                                onClick={handleDeleteUser}
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}