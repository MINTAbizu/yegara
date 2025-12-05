import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateOrder() {
  const [taskName, setTaskName] = useState("");
  const [inviteType, setInviteType] = useState("single");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order Created:\nTask: ${taskName}\nInvite Type: ${inviteType}`);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm p-4 rounded-4">
            <h3 className="fw-bold mb-3">Create Order</h3>
            <p className="text-danger small mb-4">
              (You need to enable the permission for group members to send messages first.)
            </p>

            <form onSubmit={handleSubmit}>
              {/* Task Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Task Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>

              {/* Invite Link Type */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Invite Link Type</label>
                <select
                  className="form-select form-select-lg rounded-3"
                  value={inviteType}
                  onChange={(e) => setInviteType(e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="folder">Folder</option>
                  <option value="group">Group Link</option>

                </select>

              </div>
              <div className="link">
                <label htmlFor="">Group link</label>
                <input type="textArea" placeholder="Enter group link per line" style={{width:'100%',height:'100px'}} />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 mt-3">
                Create Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
