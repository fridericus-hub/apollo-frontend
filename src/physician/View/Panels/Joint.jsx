import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import "dayjs/locale/it";
import { Link, useNavigate } from "react-router-dom";
import EcographImages from "../OtherComponents/EcographImages";
import GenerateImages from "../../Model/GenerateImages";
import { Modal } from "react-bootstrap";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import JointVisitQuestions from "../OtherComponents/JointVisitQuestions";
import FormModal from "../Modals/FormModal";
import a from "../../img/example_gin/1.jpg";
import b from "../../img/example_gin/2.jpg";
import c from "../../img/example_gin/3.jpg";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import { validateForm } from "../../ViewModel/Validation";

export default function Joint(props) {
    const { newVisit, setNewVisit } = useContext(NewVisitContext);
    const { selectedPatient } = useContext(PatientContext);
    const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext);

    const [joint, setJoint] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formModal, setFormModal] = useState(false);
    const [errors, setErrors] = useState({ none: "none" });

    const navigate = useNavigate();

    useEffect(() => {
        loadJoint();
    }, []);

    const end = () => {
        joint.setImages(photos);
        joint.setSelectedImages(selectedImages);
        setJoint(joint);
        let e = validateForm("jointVisit", joint);
        console.log(Object.keys(e));
        if (Object.keys(e).length == 0) {
            if (newVisit.jointPresence(joint.jointName)) {
                newVisit.deleteJoint(joint.jointName);
            }
            newVisit.addJoint(joint);
            setNewVisit(newVisit);
            setCurrentJoint("");
            console.log(newVisit);
            navigate("/newVisit/jointSelection");
        } else {
            setErrors(e);
            setFormModal(true);
        }
    };

    const loadJoint = async () => {
        let j = newVisit.getJoint(currentJoint);
        setJoint(j);
        let images = [];
        let selectedImages = [];
        if (j.images == undefined) {
            if (j.jointName == "Right knee") {
                images.push({
                    link: "https://dummyimage.com/1024x768/000/fff.jpg&text=RightKnee0",
                });
                images.push({ link: a });
                images.push({ link: b });
                images.push({ link: c });
                images.push({
                    link: "https://dummyimage.com/1024x768/000/fff.jpg&text=RightKnee4",
                });
            } else {
                images = await GenerateImages(j.jointName);
            }
        } else {
            images = j.images;
            selectedImages = j.selectedImages;
        }
        setPhotos(images);
        setSelectedImages(selectedImages);
    };

    const openModal = (e) => {
        let index = Number(
            e.target.alt.substring(e.target.alt.length - 1, e.target.alt.length)
        );
        setCurrentPhotoIndex(index);
        setShowPhotoModal(true);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        let arr = await GenerateImages();
        setPhotos((prevState) => [...prevState, arr]);
        setSelectedImages([]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return selectedPatient !== null ? (
        <div>
            <div className="box-bianco" style={style.box}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "95%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: "1",
                        }}
                    >
                        <div
                            style={{
                                overflow: "auto",
                                height: "78vh",
                                width: "100%",
                                textAlign: "center",
                                border: "1px solid #dcdcdc",
                                boxShadow: "1px 2px 6px #dcdcdc",
                                borderRadius: "20px",
                            }}
                        >
                            <div
                                style={{
                                    position: "sticky",
                                    top: "0",
                                    zIndex: "1",
                                    background: "white",
                                    borderStartEndRadius: "20px",
                                    borderStartStartRadius: "20px",
                                }}
                            >
                                <RefreshButton
                                    onClick={handleRefresh}
                                    loading={isLoading}
                                />
                            </div>
                            <EcographImages
                                handleClick={(e) => openModal(e)}
                                selectedImages={selectedImages}
                                setSelectedImages={setSelectedImages}
                                photos={photos}
                                joint={{ joint, setJoint }}
                            />
                        </div>
                    </div>

                    <div style={{ height: "78vh", flex: 2 }}>
                        {joint != null ? (
                            <JointVisitQuestions
                                joint={joint}
                                setJoint={setJoint}
                            />
                        ) : (
                            "Caricamento..."
                        )}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "95%",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Link
                            to={"/newVisit/jointSelection"}
                            style={style.forwardButton}
                            className="btn btn-danger btn-lg"
                            onClick={() => setCurrentJoint("")}
                        >
                            Cancel
                        </Link>
                    </div>
                    <div>
                        <button
                            style={style.forwardButton}
                            className="btn btn-success btn-lg"
                            onClick={end}
                        >
                            Forward
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                size="sm"
                show={showPhotoModal}
                onHide={() => setShowPhotoModal(false)}
                centered
            >
                <Modal.Body>
                    <img
                        src={
                            photos[currentPhotoIndex] != undefined
                                ? photos[currentPhotoIndex].link
                                : null
                        }
                        alt={`Photo ${currentPhotoIndex}`}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                </Modal.Body>
            </Modal>
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
        <NoContextModal
            what={" un paziente "}
            service={" nuova articolazione "}
        />
    );
}

const style = {
    buttons: {
        width: "47%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "right",
        justifyContent: "space-around",
        marginBottom: "5%",
        border: "1px solid black",
        borderRadius: "20px",
        padding: "4%",
    },

    box: {
        width: "98%",
        height: "91vh",
        borderRadius: "15px",
        background: "white",
        margin: "auto",
        marginTop: "0.5%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "1.5%",
        paddingBottom: "1.5%",
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "grey",
        width: "60%",
        borderRadius: 15,
        margin: 0,
    },
};