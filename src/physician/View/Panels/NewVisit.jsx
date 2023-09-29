import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import {
    FormControl,
    Switch,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/it";
import FollowUpHelper from "../../ViewModel/FollowUpHelper";
import { validateForm } from "../../ViewModel/Validation";
import FormModal from "../Modals/FormModal";
import { useNavigate } from "react-router-dom";
import Communication from '../../../common/Model/Communication'
import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "../../../common/View/MainContainer";

export default function NewVisit(props) {
    const nav = useNavigate();

    const { newVisit, setNewVisit } = useContext(NewVisitContext);
    const { selectedPatient } = useContext(PatientContext);

    const [activities, setActivities] = useState([""]);
    const [traumaticEvents, setTraumaticEvents] = useState([""]);
    const [visitDate, setVisitDate] = useState(
        newVisit.isInPresence ? new Date() : null
    );
    const [isFollowUp, setIsFollowUp] = useState(newVisit.followUp.followUp);
    const [disabledLeft, setDisabledLeft] = useState(
        !newVisit.physicalActivity.physicalActivity
    );
    const [physicalActivity, setPhysicalActivity] = useState(
        newVisit.physicalActivity
    );
    const [traumaticEvent, setTraumaticEvent] = useState(
        newVisit.traumaticEvent
    );
    const [disabledRight, setDisabledRight] = useState(
        newVisit.traumaticEvent.traumaticEvent === "Nessuno" ? true : false
    );
    const [formModal, setFormModal] = useState(false);
    const [errors, setErrors] = useState({ none: "none" });

    useEffect(() => {
        getTraumaticEventAndActivitiesFromServer()
    }, [])

    const getTraumaticEventAndActivitiesFromServer = async () => {
        setActivities([""])
        setTraumaticEvents([""])
        let acts = await Communication.get('exercise', '')
        let trauma = await Communication.get('traumaEvent', '')
        acts = acts.map(item => item.name)
        trauma = trauma.map(item => item.name)
        setActivities(prevState => [...prevState, ...acts])
        setTraumaticEvents(prevState => [...prevState, ...trauma])
    }

    const handleChange = (e) => {
        physicalActivity.physicalActivity = e.target.checked;
        setPhysicalActivity(physicalActivity);
        setDisabledLeft(!e.target.checked);
        if (!e.target.checked) {
            setPhysicalActivity({
                physicalActivity: false,
                physicalActivityDate: "",
                physicalActivityType: "",
            });
        }
    };

    const forward = () => {
        let o = {};
        o.traumaticEvent = traumaticEvent;
        o.physicalActivity = physicalActivity;
        o.visitDate = visitDate;
        let e = validateForm("newVisit", o);
        console.log(Object.keys(e));
        if (Object.keys(e).length == 0) {
            newVisit.setIsFollowUp(isFollowUp);
            newVisit.setVisitDate(visitDate);
            newVisit.setPhysicalActivity(physicalActivity);
            newVisit.setTraumaticEvent(traumaticEvent);
            setNewVisit(newVisit);
            setErrors({});
            console.log(newVisit);
            nav("/newVisit/jointSelection");
        } else {
            setErrors(e);
            setFormModal(true);
        }
    };

    const modifyDate = (date, whatDate) => {
        switch (whatDate) {
            case "physicalActivityDate":
                physicalActivity.physicalActivityDate = format(date, "y-MM-dd");
                setPhysicalActivity(physicalActivity);
                return;
            case "traumaDate":
                traumaticEvent.traumaticEventDate = format(date, "y-MM-dd");
                setTraumaticEvent(traumaticEvent);
                return;
            case "visitDate":
                setVisitDate(date);
                return;
        }
    };

    const displayActivityItems = () => {
        return activities.map((element) => (
            <MenuItem value={element}>{element}</MenuItem>
        ));
    };
    const displayTraumaticItems = () => {
        return traumaticEvents.map((element) => (
            <MenuItem value={element}>{element}</MenuItem>
        ));
    };

    const handleActivity = (e) => {
        let newPhysicalActivity = { ...physicalActivity };
        newPhysicalActivity.physicalActivityType = e.target.value;
        setPhysicalActivity(newPhysicalActivity);
    };

    const handleTrauma = (e) => {
        let newtraumaticEvent = { ...traumaticEvent };
        if (e.target.value === "Nessuno") {
            setDisabledRight(true);
            newtraumaticEvent.traumaticEventDate = "";
        } else {
            setDisabledRight(false);
        }
        newtraumaticEvent.traumaticEvent = e.target.value;
        setTraumaticEvent(newtraumaticEvent);
    };

    const followUp = (e) => {
        setIsFollowUp(e.target.checked);
    };

    const datePickerResolver = (b, s) => {
        if (b) {
            return (
                <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    disabled
                />
            );
        } else {
            return (
                <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    onChange={(newValue) => modifyDate(newValue.$d, s)}
                    label={
                        s == "traumaDate"
                            ? traumaticEvent.traumaticEventDate
                            : physicalActivity.physicalActivityDate
                    }
                />
            );
        }
    };

    const handleCancel = () => {
        setIsFollowUp(false);
    };

    const saveInfo = () => {
        newVisit.setIsFollowUp(isFollowUp);
        newVisit.setVisitDate(new Date());
        newVisit.setPhysicalActivity(physicalActivity);
        newVisit.setTraumaticEvent(traumaticEvent);
        setNewVisit(newVisit);
    };

    return selectedPatient !== null ? (
        <div>
            <MainContainer>
                <div style={style.monoButtons}>
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <label style={{ fontSize: 22 }}>
                            È una visita di follow-up?
                        </label>
                        <Switch checked={isFollowUp} onChange={followUp} />
                    </div>
                    <div>
                        {isFollowUp && (
                            <FollowUpHelper
                                onCancel={handleCancel}
                                seeVisit={saveInfo}
                            />
                        )}
                    </div>
                </div>

                {!newVisit.isInPresence && (
                    <div style={style.monoButtons}>
                        <div>
                            <label style={{ fontSize: 22 }}>
                                Qual è la data della visita?
                            </label>
                        </div>
                        <div>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="it"
                            >
                                <DatePicker
                                    slotProps={{ textField: { size: "small" } }}
                                    onChange={(newValue) =>
                                        modifyDate(newValue.$d, "visitDate")
                                    }
                                    label={
                                        newVisit.visitDate != undefined
                                            ? format(
                                                newVisit.visitDate,
                                                "dd-MM-Y"
                                            )
                                            : "DD-MM-YYYY"
                                    }
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                )}

                <div style={style.buttons}>
                    <div style={{ display: "flex" }}>
                        <label style={{ fontSize: 22 }}>
                            Il paziente ha svolto attività fisica?
                        </label>
                        <Switch
                            defaultChecked={
                                newVisit === null
                                    ? false
                                    : newVisit.physicalActivity.physicalActivity
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="it"
                        >
                            {datePickerResolver(
                                disabledLeft,
                                "physicalActivityDate"
                            )}
                        </LocalizationProvider>
                    </div>
                    <div>
                        <FormControl
                            fullWidth
                            disabled={disabledLeft}
                            style={{ minWidth: 120, fontSize: 22 }}
                        >
                            <InputLabel id="demo-simple-select-label">
                                Attività fisica
                            </InputLabel>

                            <Select
                                style={{ fontSize: 22 }}
                                id="demo-simple-select"
                                label="esercizio"
                                value={physicalActivity.physicalActivityType}
                                onChange={handleActivity}
                            >
                                {activities.length > 0 ? displayActivityItems() : <CircularProgress style={{ padding: 2 }} color="info" size={25} />}
                            </Select>

                        </FormControl>
                    </div>
                </div>

                <div style={style.buttons}>
                    <div>
                        <label style={{ fontSize: 22 }}>
                            Indicare evento traumatico, se presente
                        </label>
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ width: 160 }}
                            >
                                Evento
                            </InputLabel>

                            <Select
                                style={{ fontSize: 22 }}
                                id="demo-simple-select"
                                label="event"
                                value={traumaticEvent.traumaticEvent}
                                onChange={handleTrauma}
                            >
                                {traumaticEvents.length > 0 ? displayTraumaticItems() : <CircularProgress style={{ padding: 2 }} color="info" size={25} />}
                            </Select>

                        </FormControl>
                    </div>
                    <div>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="it"
                        >
                            {datePickerResolver(disabledRight, "traumaDate")}
                        </LocalizationProvider>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        height: '15vh',
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "95%",
                    }}
                >
                    <div>
                        <Link
                            onClick={() => setNewVisit(null)}
                            to={"/searchVisit/"}
                            className="btn btn-danger"
                        >
                            Annulla
                        </Link>
                    </div>
                    <div>
                        <button
                            style={style.forwardButton}
                            className="btn btn-success"
                            onClick={forward}
                        >
                            Prosegui
                        </button>
                    </div>
                </div>
            </MainContainer>

            <div>
                {formModal && (
                    <FormModal
                        formModal={formModal}
                        setFormModal={setFormModal}
                        errors={errors}
                    />
                )}
            </div>
        </div>
    ) : (
        <NoContextModal what={" un paziente "} service={" nuova visita "} />
    );
}

const style = {
    monoButtons: {
        display: "flex",
        flexDirection: "row",
        width: "47%",
        height: "10vh",
        padding: "1.5%",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #dcdcdc",
        borderRadius: "20px",
        boxShadow: "1px 2px 6px #dcdcdc",
    },

    buttons: {
        width: "47%",
        height: "25vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        border: "1px solid #dcdcdc",
        borderRadius: "20px",
        boxShadow: "1px 2px 6px #dcdcdc",
        padding: "1.5%",
    },

    box: {
        justifyContent: "space-around",
        width: "98%",
        height: "90vh",
        borderRadius: "15px",
        background: "white",
        margin: "auto",
        marginTop: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    verticalLine: {
        width: 1,
        backgroundColor: "grey",
        height: "60%",
        borderRadius: 15,
        margin: 0,
        marginBottom: "7%",
    },
};
