import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Ellipses from "../components/Ellipses";

const ShowImportant = (props) => {
  const url = "http://localhost:3001/tasks/important";
  const [task, setTask] = useState([]);

  const getTask = async () => {
    const token = await props.user.getIdToken();
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    setTask(data);
  };

  useEffect(() => {
    if (props.user) {
      getTask();
    }
  }, [props.user]);
  
  // functions to handle delete & edit
const handleDelete = (itemId) => {
  setTask(task.filter((task) => task._id !== itemId));
};

    // not working quite yet
const handleEdit = async (itemId, newData) => {
  try {
    const updatedTask = await Promise.all(
      task.map(async (task) => {
        if (task._id === itemId) {
          return { ...task, ...newData };
        } else {
          return task;
        }
      })
    );
    setTask(updatedTask);
  } catch (error) {
    console.error(error);
  }
};

const loaded = () => {
  return (
    <div>
      <h1>Important Tasks</h1>
        {task.map(task => (
          <p key={task._id}>
            <Link to={`/tasks/${task._id}/subtasks`}>{task.title}</Link>
            <Ellipses itemId={task._id} onDelete={handleDelete} onEdit={handleEdit} />
          </p>
        ))}
      </div>
    );
  };

  const loading = () => {
    return <h1>Loading...</h1>;
  };

  return task ? loaded() : loading();
};

export default ShowImportant;
