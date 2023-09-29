import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import PhysicianTask from "../../../common/Model/PhysicianTask";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/Communication";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";

export default function UserTasks({ user }: { user: User }) {
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);

    const [includeCompleted, setIncludeCompleted] = useState(false);
    const [status, setStatus] = useState<Status>(Status.LOADING);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await user!.tasks(includeCompleted);

            console.log(`${res.length} task recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [user, includeCompleted]);

    useEffect(() => {
        fetchData();

        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE) {
        return (
            <Box>
                <Typography variant="h6">
                    {status === Status.LOADING
                        ? "Caricamento in corso..."
                        : "Errore nel caricamento dei task di annotazione"}
                </Typography>

                <LoadingButton
                    loading={status === Status.LOADING}
                    loadingPosition="start"
                    startIcon={<RefreshIcon />}
                    variant="contained"
                    color="error"
                    onClick={fetchData}
                >
                    Ricarica
                </LoadingButton>
            </Box>
        );
    }

    return (
        <>
            <Box sx={style.headerBox}>
                <Typography variant="h5">
                    Task di annotazione assegnati:
                </Typography>
                <Box sx={{ flex: 1 }} />
                <FormControlLabel
                    style={{ margin: "auto" }}
                    control={
                        <Switch
                            checked={includeCompleted}
                            onChange={() =>
                                setIncludeCompleted(!includeCompleted)
                            }
                        />
                    }
                    label="Includi task completati"
                />
            </Box>
            {tasks.length === 0 ? (
                <Typography variant="h6">
                    Nessun task di annotazione assegnato
                </Typography>
            ) : (
                <TasksList tasks={tasks} />
            )}
        </>
    );
}

const TasksList = ({ tasks }: { tasks: PhysicianTask[] }) => {
    return (
        <Box sx={style.scrollable}>
            <List>
                {tasks.map((task) => (
                    <Box key={task.id}>
                        <TaskItem task={task} />
                        <Divider sx={{ backgroundColor: "black" }} />
                    </Box>
                ))}
            </List>
        </Box>
    );
};

const TaskItem = ({ task }: { task: PhysicianTask }) => {
    const navigate = useNavigate();

    const navigateToTask = useCallback(() => {
        navigate("/admin/tasks/?id=" + task.id);
    }, [navigate, task.id]);

    return (
        <ListItemButton onClick={navigateToTask}>
            <ListItemText
                primary={task.name()}
                secondary={`Deadline: ${task.deadline}`}
            />
            <ListItemText
                primary={`${task.annotated_media}/${task.media_count}`}
                primaryTypographyProps={{ align: "right" }}
            />
        </ListItemButton>
    );
};

const style = {
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        margin: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
    headerBox: {
        display: "flex",
        flexDirection: "row" as "row",
    },
};
